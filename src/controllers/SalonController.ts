import type { Request, Response } from "express";
import Salon from "../models/Salon";

export class SalonController {
  static crearSalon = async (req: Request, res: Response) => {
    const salon = new Salon(req.body);

    try {
      await salon.save();
      res.send("Salón creado correctamente");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al crear el salón" });
    }
  };

  static obtenerSalones = async (req: Request, res: Response) => {
    try {
      const salones = await Salon.find({});
      res.json(salones);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al obtener los salones" });
    }
  };

  static obtenerSalonPorId = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const salon = await Salon.findById(id);

      if (!salon) {
        const error = new Error("Salón no encontrado");
        return res.status(404).json({ error: error.message });
      }
      res.json(salon);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al obtener el salón" });
    }
  };

  static actualizarSalon = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const salon = await Salon.findByIdAndUpdate(id, req.body, { new: true });

      if (!salon) {
        const error = new Error("Salón no encontrado");
        return res.status(404).json({ error: error.message });
      }

      res.json("Salón actualizado correctamente");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al actualizar el salón" });
    }
  };

  static eliminarSalon = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const salon = await Salon.findById(id);

      if (!salon) {
        const error = new Error("Salón no encontrado");
        return res.status(404).json({ error: error.message });
      }

      await salon.deleteOne();
      res.json("Salón eliminado correctamente");
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al eliminar el salón" });
    }
  };
}

export default SalonController;
