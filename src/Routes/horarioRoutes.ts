import { Router } from "express";
import { HorarioController } from "../controllers/HorarioController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post(
  "/generar",
  body("horaInicio").notEmpty(),
  body("horaFin").notEmpty(),
  handleInputErrors,
  HorarioController.generarHorario
);

router.get("/", HorarioController.obtenerHorario);

router.delete("/eliminar", HorarioController.eliminarHorario);

export default router;
