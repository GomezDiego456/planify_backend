import { Router } from 'express'
import { ProjectController } from '../controllers/ProjectController'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'

const router = Router()

router.post('/', 
    //hacemos las validaciones con express-validator
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion es obligatoria'),
    //luego manejamos los errores
    handleInputErrors,
    //si pasa las validaciones, se ejecuta el controlador
    ProjectController.createProject
)

router.get('/', ProjectController.getAllProjects)

router.get('/:id', 
    //validamos que el id sea un id de mongo
    param('id')
        .isMongoId().withMessage('ID de proyecto inválido'),
    handleInputErrors,
    ProjectController.getProjectById
)

router.put('/:id', 
    //hacemos las validaciones
    body('projectName')
        .notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripcion es obligatoria'),
    //luego manejamos los errores
    handleInputErrors,
    //si pasa las validaciones, se ejecuta el controlador
    ProjectController.updateProject
)

router.delete('/:id', 
    //validamos que el id sea un id de mongo
    param('id')
        .isMongoId().withMessage('ID de proyecto inválido'),
    handleInputErrors,
    ProjectController.deleteProject
)

export default router
