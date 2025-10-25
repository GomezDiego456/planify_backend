import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { SalonController } from "../controllers/SalonController";

const router = Router();

// Crear un nuevo salón
router.post(
  "/",
  authenticate,
  body("nombre").notEmpty().withMessage("El nombre del salón es obligatorio"),
  body("tipo").notEmpty().withMessage("El tipo de salón es obligatorio"),
  body("capacidad")
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un número entero positivo"),
  body("ubicacion").notEmpty().withMessage("La ubicación es obligatoria"),
  handleInputErrors,
  SalonController.crearSalon
);

// Obtener todos los salones
router.get("/", SalonController.obtenerSalones);

// Obtener un salón por ID
router.get(
  "/:id",
  param("id").isMongoId().withMessage("ID de salón inválido"),
  handleInputErrors,
  SalonController.obtenerSalonPorId
);

// Actualizar un salón
router.put(
  "/:id",
  param("id").isMongoId().withMessage("ID de salón inválido"),
  body("nombre")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío"),
  body("tipo")
    .optional()
    .notEmpty()
    .withMessage("El tipo no puede estar vacío"),
  body("capacidad")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un número entero positivo"),
  body("ubicacion")
    .optional()
    .notEmpty()
    .withMessage("La ubicación no puede estar vacía"),
  handleInputErrors,
  SalonController.actualizarSalon
);

// Eliminar un salón
router.delete(
  "/:id",
  param("id").isMongoId().withMessage("ID de salón inválido"),
  handleInputErrors,
  SalonController.eliminarSalon
);

export default router;
