import type { Request, Response } from "express";
import Asignatura from "../models/Asignatura";

export class AsignaturaController {
  // Crear una nueva asignatura
  static crearAsignatura = async (req: Request, res: Response) => {
    const asignatura = new Asignatura(req.body);

    try {
      await asignatura.save();
      res.status(201).send("Asignatura creada correctamente");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear la asignatura" });
    }
  };

  // Obtener todas las asignaturas
  static obtenerAsignaturas = async (req: Request, res: Response) => {
    try {
      const asignaturas = await Asignatura.find({}).populate(
        "profesor",
        "nombreCompleto"
      );
      res.json(asignaturas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener las asignaturas" });
    }
  };

  // Obtener una asignatura por ID
  static obtenerAsignaturaPorId = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const asignatura = await Asignatura.findById(id).populate(
        "profesor",
        "nombreCompleto correo"
      );

      if (!asignatura) {
        return res.status(404).json({ error: "Asignatura no encontrada" });
      }

      res.json(asignatura);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al buscar la asignatura" });
    }
  };

  // Actualizar asignatura
  static actualizarAsignatura = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const asignatura = await Asignatura.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      if (!asignatura) {
        return res.status(404).json({ error: "Asignatura no encontrada" });
      }

      res.json("Asignatura actualizada correctamente");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar la asignatura" });
    }
  };

  // Eliminar asignatura
  static eliminarAsignatura = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const asignatura = await Asignatura.findById(id);

      if (!asignatura) {
        return res.status(404).json({ error: "Asignatura no encontrada" });
      }

      await asignatura.deleteOne();
      res.json("Asignatura eliminada correctamente");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al eliminar la asignatura" });
    }
  };
}

export default AsignaturaController;
