import { Router } from "express";
import { DisponibilidadController } from "../controllers/DisponibilidadController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

/**
 * GET /disponibilidad/profesores-restringidos
 * Obtener todos los profesores con disponible=false y sus restricciones
 */
router.get(
  "/profesores-restringidos",
  DisponibilidadController.obtenerProfesoresRestringidos
);

/**
 * POST /disponibilidad/:profesorId
 * Crear o actualizar disponibilidad de un profesor
 */
router.post(
  "/:profesorId",
  param("profesorId").isMongoId().withMessage("ID de profesor inválido"),
  body("bloques")
    .isArray({ min: 1 })
    .withMessage("Debe proporcionar al menos un bloque de disponibilidad"),
  body("bloques.*.dia")
    .isIn(["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"])
    .withMessage("Día inválido"),
  body("bloques.*.horaInicio")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Formato de hora inicio inválido (HH:MM)"),
  body("bloques.*.horaFin")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Formato de hora fin inválido (HH:MM)"),
  handleInputErrors,
  DisponibilidadController.guardarDisponibilidad
);

/**
 * GET /disponibilidad/:profesorId
 * Obtener disponibilidad de un profesor específico
 */
router.get(
  "/:profesorId",
  param("profesorId").isMongoId().withMessage("ID de profesor inválido"),
  handleInputErrors,
  DisponibilidadController.obtenerDisponibilidadProfesor
);

/**
 * DELETE /disponibilidad/:profesorId
 * Eliminar disponibilidad de un profesor
 */
router.delete(
  "/:profesorId",
  param("profesorId").isMongoId().withMessage("ID de profesor inválido"),
  handleInputErrors,
  DisponibilidadController.eliminarDisponibilidad
);

export default router;
