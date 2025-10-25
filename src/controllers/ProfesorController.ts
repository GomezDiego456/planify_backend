import type { Request, Response } from "express";
import Profesor from "../models/Profesor";

export class ProfesorController {
  // Crear un nuevo profesor
  static crearProfesor = async (req: Request, res: Response) => {
    const profesor = new Profesor(req.body);

    try {
      await profesor.save();
      res.status(201).send("Profesor creado correctamente");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al crear el profesor" });
    }
  };

  // Obtener todos los profesores
  static obtenerProfesores = async (req: Request, res: Response) => {
    try {
      const profesores = await Profesor.find({});
      res.json(profesores);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los profesores" });
    }
  };

  // Obtener un profesor por ID
  static obtenerProfesorPorId = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const profesor = await Profesor.findById(id);

      if (!profesor) {
        return res.status(404).json({ error: "Profesor no encontrado" });
      }

      res.json(profesor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al buscar el profesor" });
    }
  };

  // Actualizar un profesor por ID
  static actualizarProfesor = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const profesor = await Profesor.findByIdAndUpdate(id, req.body, {
        new: true, // devuelve el documento actualizado
      });

      if (!profesor) {
        return res.status(404).json({ error: "Profesor no encontrado" });
      }

      res.json("Profesor actualizado correctamente");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el profesor" });
    }
  };

  // Eliminar un profesor por ID
  static eliminarProfesor = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const profesor = await Profesor.findById(id);

      if (!profesor) {
        return res.status(404).json({ error: "Profesor no encontrado" });
      }

      await profesor.deleteOne();
      res.json("Profesor eliminado correctamente");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al eliminar el profesor" });
    }
  };
}

export default ProfesorController;
