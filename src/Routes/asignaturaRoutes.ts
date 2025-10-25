import { Router } from "express";
import { AsignaturaController } from "../controllers/AsignaturaController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";

const router = Router();

// Crear asignatura
router.post(
  "/",
  authenticate,
  body("nombre")
    .notEmpty()
    .withMessage("El nombre de la asignatura es obligatorio"),
  body("codigo")
    .notEmpty()
    .withMessage("El código de la asignatura es obligatorio"),
  handleInputErrors,
  AsignaturaController.crearAsignatura
);

// Obtener todas las asignaturas
router.get("/", authenticate, AsignaturaController.obtenerAsignaturas);

// Obtener asignatura por ID
router.get(
  "/:id",
  authenticate,
  param("id").isMongoId().withMessage("ID de asignatura inválido"),
  handleInputErrors,
  AsignaturaController.obtenerAsignaturaPorId
);

// Actualizar asignatura
router.put(
  "/:id",
  authenticate,
  param("id").isMongoId().withMessage("ID de asignatura inválido"),
  body("nombre")
    .notEmpty()
    .withMessage("El nombre de la asignatura es obligatorio"),
  body("codigo")
    .notEmpty()
    .withMessage("El código de la asignatura es obligatorio"),
  handleInputErrors,
  AsignaturaController.actualizarAsignatura
);

// Eliminar asignatura
router.delete(
  "/:id",
  authenticate,
  param("id").isMongoId().withMessage("ID de asignatura inválido"),
  handleInputErrors,
  AsignaturaController.eliminarAsignatura
);

export default router;
