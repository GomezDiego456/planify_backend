import { Request, Response } from "express";
import Horario from "../models/Horario";
import Asignatura from "../models/Asignatura";
import Profesor from "../models/Profesor";
import Salon from "../models/Salon";
import DisponibilidadProfesor from "../models/DisponibilidadProfesor";

export class HorarioController {
  static generarHorario = async (req: Request, res: Response) => {
    const { horaInicio, horaFin } = req.body;

    try {
      // Obtener asignaturas CON su profesor asignado
      const asignaturas = await Asignatura.find({}).populate("profesor");
      const profesores = await Profesor.find({});
      const salones = await Salon.find({});

      if (!asignaturas.length || !profesores.length || !salones.length) {
        return res
          .status(400)
          .json({ error: "Faltan datos para generar el horario." });
      }

      // Verificar que todas las asignaturas tengan profesor asignado
      const asignaturasSinProfesor = asignaturas.filter((a) => !a.profesor);
      if (asignaturasSinProfesor.length > 0) {
        return res.status(400).json({
          error: `Las siguientes asignaturas no tienen profesor asignado: ${asignaturasSinProfesor
            .map((a) => a.nombre)
            .join(", ")}`,
        });
      }

      // Limpiar horario previo
      await Horario.deleteMany({});

      const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
      let horarioGenerado: any[] = [];

      // Cargar disponibilidades de profesores restringidos
      const disponibilidades = await DisponibilidadProfesor.find({});
      const disponibilidadMap = new Map();
      disponibilidades.forEach((disp) => {
        disponibilidadMap.set(disp.profesor.toString(), disp.bloques);
      });

      console.log("📋 Disponibilidades cargadas:", disponibilidadMap.size);
      console.log("👨‍🏫 Profesores totales:", profesores.length);
      console.log(
        "🔒 Profesores con disponibilidad total:",
        profesores.filter((p) => p.disponible).length
      );
      console.log("⚙️ Profesores con restricciones:", disponibilidadMap.size);

      // Función auxiliar
      function sumarHoras(hora: string, cantidad: number): string {
        let [h, m] = hora.split(":").map(Number);
        h += cantidad;
        return `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}`;
      }

      // Función para verificar si un profesor está disponible en un horario
      function profesorDisponibleEnHorario(
        profesorId: string,
        profesorDisponible: boolean,
        dia: string,
        horaInicio: string,
        horaFin: string
      ): boolean {
        // Si el profesor tiene disponibilidad total (disponible = true)
        if (profesorDisponible) {
          console.log(`✅ Profesor ${profesorId} disponible TODO el tiempo`);
          return true;
        }

        // Si tiene restricciones, verificar sus bloques
        const bloques = disponibilidadMap.get(profesorId);
        if (!bloques || bloques.length === 0) {
          console.log(
            `❌ Profesor ${profesorId} SIN bloques configurados y sin disponibilidad total`
          );
          return false;
        }

        // Verificar si el horario solicitado está dentro de algún bloque disponible
        const disponible = bloques.some((bloque: any) => {
          if (bloque.dia !== dia) return false;

          // Convertir horas a minutos para comparación precisa
          const bloqueInicio = bloque.horaInicio.split(":").map(Number);
          const bloqueFin = bloque.horaFin.split(":").map(Number);
          const claseInicio = horaInicio.split(":").map(Number);
          const claseFin = horaFin.split(":").map(Number);

          const bloqueInicioMin = bloqueInicio[0] * 60 + bloqueInicio[1];
          const bloqueFinMin = bloqueFin[0] * 60 + bloqueFin[1];
          const claseInicioMin = claseInicio[0] * 60 + claseInicio[1];
          const claseFinMin = claseFin[0] * 60 + claseFin[1];

          // La clase debe estar completamente dentro del bloque disponible
          return (
            claseInicioMin >= bloqueInicioMin && claseFinMin <= bloqueFinMin
          );
        });

        if (disponible) {
          console.log(
            `✅ Profesor ${profesorId} DISPONIBLE en ${dia} ${horaInicio}-${horaFin}`
          );
        } else {
          console.log(
            `❌ Profesor ${profesorId} NO disponible en ${dia} ${horaInicio}-${horaFin}`
          );
        }

        return disponible;
      }

      // Horas semanales restantes por asignatura
      const horasRestantes = asignaturas.map((a) => ({
        asignatura: a,
        horas: a.duracionHoras || 2,
      }));

      // ----------- GENERACIÓN DEL HORARIO -----------

      for (const dia of dias) {
        let actual = horaInicio;

        while (actual < horaFin) {
          // Horas disponibles desde la hora actual
          const horasDisponiblesHoy =
            parseInt(horaFin.split(":")[0]) - parseInt(actual.split(":")[0]);

          if (horasDisponiblesHoy <= 0) break;

          // Intentamos llenar TODOS los salones en esta misma hora
          for (const salonRandom of salones) {
            // Asignaturas con horas pendientes
            const disponibles = horasRestantes.filter((h) => h.horas > 0);
            if (!disponibles.length) break;

            const asignData = disponibles[0];
            const asignatura = asignData.asignatura;

            // ✅ CORRECCIÓN: Obtener el profesor ASIGNADO a esta asignatura
            const profesorAsignado = asignatura.profesor as any;
            if (!profesorAsignado) {
              console.log(
                `⚠️ Asignatura ${asignatura.nombre} sin profesor asignado`
              );
              continue;
            }

            // Evitar poner la misma asignatura en el mismo bloque horario en otro salón
            const yaAsignada = horarioGenerado.some(
              (h) =>
                h.dia === dia &&
                h.horaInicio === actual &&
                h.asignatura.toString() === asignatura._id.toString()
            );
            if (yaAsignada) continue;

            const horasAsignar = Math.min(horasDisponiblesHoy, asignData.horas);
            const horaFinBloque = sumarHoras(actual, horasAsignar);

            console.log(
              `\n🔍 Intentando asignar: ${asignatura.nombre} - ${dia} ${actual}-${horaFinBloque}`
            );
            console.log(
              `👨‍🏫 Profesor asignado: ${profesorAsignado.nombreCompleto}`
            );

            // ✅ Verificar que el profesor ASIGNADO no tenga choque de horario
            const choqueProfesor = horarioGenerado.some(
              (h) =>
                h.dia === dia &&
                h.profesor.toString() === profesorAsignado._id.toString() &&
                ((actual >= h.horaInicio && actual < h.horaFin) ||
                  (horaFinBloque > h.horaInicio && horaFinBloque <= h.horaFin))
            );

            if (choqueProfesor) {
              console.log(`❌ Profesor ya tiene clase en este horario`);
              continue;
            }

            // ✅ Verificar disponibilidad del profesor ASIGNADO según sus restricciones
            const disponible = profesorDisponibleEnHorario(
              profesorAsignado._id.toString(),
              profesorAsignado.disponible,
              dia,
              actual,
              horaFinBloque
            );

            if (!disponible) {
              console.log(
                `❌ Profesor NO disponible por restricciones de horario`
              );
              continue;
            }

            // Verificar que el salón esté libre
            const choqueSalon = horarioGenerado.some(
              (h) =>
                h.dia === dia &&
                h.salon.toString() === salonRandom._id.toString() &&
                ((actual >= h.horaInicio && actual < h.horaFin) ||
                  (horaFinBloque > h.horaInicio && horaFinBloque <= h.horaFin))
            );

            if (choqueSalon) {
              console.log(`❌ Salón ocupado`);
              continue;
            }

            // Crear bloque horario
            console.log(`✅ ASIGNADO exitosamente`);
            horarioGenerado.push({
              dia,
              horaInicio: actual,
              horaFin: horaFinBloque,
              asignatura: asignatura._id,
              profesor: profesorAsignado._id,
              salon: salonRandom._id,
            });

            // Descontar horas pendientes
            asignData.horas -= horasAsignar;
          }

          // Avanzar el tiempo 1 hora (siguiente bloque)
          actual = sumarHoras(actual, 1);
        }
      }

      console.log(`\n📊 Horario generado: ${horarioGenerado.length} bloques`);

      // Guardar en la BD
      const horarioDB = await Horario.insertMany(horarioGenerado);

      // Retornar con nombres poblados
      const horarioConNombres = await Horario.find({
        _id: { $in: horarioDB.map((h) => h._id) },
      })
        .populate("asignatura", "nombre")
        .populate("profesor", "nombreCompleto")
        .populate("salon", "nombre");

      res.json(horarioConNombres);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Error al generar el horario" });
    }
  };

  static obtenerHorario = async (req: Request, res: Response) => {
    try {
      const horario = await Horario.find({})
        .populate("asignatura", "nombre")
        .populate("profesor", "nombreCompleto")
        .populate("salon", "nombre");

      res.json(horario);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el horario" });
    }
  };

  static eliminarHorario = async (req: Request, res: Response) => {
    try {
      await Horario.deleteMany({});
      res.json({ message: "Horario eliminado correctamente" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Error al eliminar el horario" });
    }
  };
}
