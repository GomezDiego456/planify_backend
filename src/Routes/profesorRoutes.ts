import { Router } from "express";
import { ProfesorController } from "../controllers/ProfesorController";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
// import { authenticate } from "../middleware/auth";

const router = Router();

// Crear profesor
router.post(
  "/",
  // authenticate,
  body("nombreCompleto")
    .notEmpty()
    .withMessage("El nombre del profesor es obligatorio"),
  body("correo")
    .isEmail()
    .withMessage("Debe proporcionar un correo electrónico válido"),
  handleInputErrors,
  ProfesorController.crearProfesor
);

// Obtener todos los profesores
router.get("/", /*authenticate,*/ ProfesorController.obtenerProfesores);

// Obtener profesor por ID
router.get(
  "/:id",
  /*authenticate,*/
  param("id").isMongoId().withMessage("ID de profesor inválido"),
  handleInputErrors,
  ProfesorController.obtenerProfesorPorId
);

// Actualizar profesor
router.put(
  "/:id",
  /*authenticate,*/
  param("id").isMongoId().withMessage("ID de profesor inválido"),
  body("nombreCompleto")
    .notEmpty()
    .withMessage("El nombre del profesor es obligatorio"),
  body("correo")
    .isEmail()
    .withMessage("Debe proporcionar un correo electrónico válido"),
  handleInputErrors,
  ProfesorController.actualizarProfesor
);

// Eliminar profesor
router.delete(
  "/:id",
  /*authenticate,*/
  param("id").isMongoId().withMessage("ID de profesor inválido"),
  handleInputErrors,
  ProfesorController.eliminarProfesor
);

export default router;
