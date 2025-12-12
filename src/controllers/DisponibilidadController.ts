// controllers/DisponibilidadController.ts
import { Request, Response } from "express";
import DisponibilidadProfesor from "../models/DisponibilidadProfesor";
import Profesor from "../models/Profesor";

export class DisponibilidadController {
  /**
   * Crear o actualizar disponibilidad de un profesor
   * POST /disponibilidad/:profesorId
   */
  static guardarDisponibilidad = async (req: Request, res: Response) => {
    const { profesorId } = req.params;
    const { bloques } = req.body;

    try {
      // Verificar que el profesor existe
      const profesor = await Profesor.findById(profesorId);
      if (!profesor) {
        return res.status(404).json({ error: "Profesor no encontrado" });
      }

      // Verificar que el profesor NO tiene disponibilidad total
      if (profesor.disponible) {
        return res.status(400).json({
          error:
            "Este profesor tiene disponibilidad total. No necesita restricciones.",
        });
      }

      // Validar que hay bloques
      if (!bloques || bloques.length === 0) {
        return res.status(400).json({
          error: "Debe proporcionar al menos un bloque de disponibilidad",
        });
      }

      // Buscar si ya existe disponibilidad para este profesor
      let disponibilidad = await DisponibilidadProfesor.findOne({
        profesor: profesorId,
      });

      if (disponibilidad) {
        // Actualizar existente
        disponibilidad.bloques = bloques;
        await disponibilidad.save();
        res.json({
          message: "Disponibilidad actualizada correctamente",
          data: disponibilidad,
        });
      } else {
        // Crear nueva
        disponibilidad = new DisponibilidadProfesor({
          profesor: profesorId,
          bloques,
        });
        await disponibilidad.save();
        res.status(201).json({
          message: "Disponibilidad creada correctamente",
          data: disponibilidad,
        });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: "Error al guardar la disponibilidad" });
    }
  };

  /**
   * Obtener disponibilidad de un profesor específico
   * GET /disponibilidad/:profesorId
   */
  static obtenerDisponibilidadProfesor = async (
    req: Request,
    res: Response
  ) => {
    const { profesorId } = req.params;

    try {
      const disponibilidad = await DisponibilidadProfesor.findOne({
        profesor: profesorId,
      }).populate("profesor", "nombreCompleto correo");

      if (!disponibilidad) {
        return res.status(404).json({
          error: "No se encontró disponibilidad para este profesor",
        });
      }

      res.json(disponibilidad);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener la disponibilidad" });
    }
  };

  /**
   * Obtener todos los profesores sin disponibilidad total
   * y sus restricciones si las tienen
   * GET /disponibilidad/profesores-restringidos
   */
  static obtenerProfesoresRestringidos = async (
    req: Request,
    res: Response
  ) => {
    try {
      // Buscar profesores con disponible = false
      const profesoresRestringidos = await Profesor.find({ disponible: false });

      // Para cada uno, buscar su disponibilidad
      const profesoresConDisponibilidad = await Promise.all(
        profesoresRestringidos.map(async (profesor) => {
          const disponibilidad = await DisponibilidadProfesor.findOne({
            profesor: profesor._id,
          });

          return {
            _id: profesor._id,
            nombreCompleto: profesor.nombreCompleto,
            correo: profesor.correo,
            departamento: profesor.departamento,
            tieneDisponibilidad: !!disponibilidad,
            bloques: disponibilidad ? disponibilidad.bloques : [],
          };
        })
      );

      res.json(profesoresConDisponibilidad);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error al obtener profesores restringidos" });
    }
  };

  /**
   * Eliminar disponibilidad de un profesor
   * DELETE /disponibilidad/:profesorId
   */
  static eliminarDisponibilidad = async (req: Request, res: Response) => {
    const { profesorId } = req.params;

    try {
      const disponibilidad = await DisponibilidadProfesor.findOneAndDelete({
        profesor: profesorId,
      });

      if (!disponibilidad) {
        return res.status(404).json({
          error: "No se encontró disponibilidad para este profesor",
        });
      }

      res.json({ message: "Disponibilidad eliminada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al eliminar la disponibilidad" });
    }
  };
}

export default DisponibilidadController;
