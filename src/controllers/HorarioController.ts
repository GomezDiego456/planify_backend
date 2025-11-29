import { Request, Response } from "express";
import Horario from "../models/Horario";
import Asignatura from "../models/Asignatura";
import Profesor from "../models/Profesor";
import Salon from "../models/Salon";

export class HorarioController {
  static generarHorario = async (req: Request, res: Response) => {
    const { horaInicio, horaFin } = req.body;

    try {
      const asignaturas = await Asignatura.find({});
      const profesores = await Profesor.find({});
      const salones = await Salon.find({});

      if (!asignaturas.length || !profesores.length || !salones.length) {
        return res
          .status(400)
          .json({ error: "Faltan datos para generar el horario." });
      }

      // Limpiar horario previo
      await Horario.deleteMany({});

      const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
      let horarioGenerado: any[] = [];

      // Función auxiliar
      function sumarHoras(hora: string, cantidad: number): string {
        let [h, m] = hora.split(":").map(Number);
        h += cantidad;
        return `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")}`;
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

            // Buscar profesor disponible en esta hora
            const profesorRandom = profesores.find((p) => {
              const choque = horarioGenerado.some(
                (h) =>
                  h.dia === dia &&
                  h.profesor.toString() === p._id.toString() &&
                  ((actual >= h.horaInicio && actual < h.horaFin) ||
                    (horaFinBloque > h.horaInicio &&
                      horaFinBloque <= h.horaFin))
              );
              return !choque;
            });

            if (!profesorRandom) continue;

            // Verificar que el salón esté libre
            const choqueSalon = horarioGenerado.some(
              (h) =>
                h.dia === dia &&
                h.salon.toString() === salonRandom._id.toString() &&
                ((actual >= h.horaInicio && actual < h.horaFin) ||
                  (horaFinBloque > h.horaInicio && horaFinBloque <= h.horaFin))
            );

            if (choqueSalon) continue;

            // Crear bloque horario
            horarioGenerado.push({
              dia,
              horaInicio: actual,
              horaFin: horaFinBloque,
              asignatura: asignatura._id,
              profesor: profesorRandom._id,
              salon: salonRandom._id,
            });

            // Descontar horas pendientes
            asignData.horas -= horasAsignar;
          }

          // Avanzar el tiempo 1 hora (siguiente bloque)
          actual = sumarHoras(actual, 1);
        }
      }

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
