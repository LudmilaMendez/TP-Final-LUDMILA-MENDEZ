import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { CreateUserValidator, UpdateUserValidator } from '../validators/users.validators';
import { validateDTO } from '../middlewares/dto.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router: Router = Router();

// Buscar por email o username (Ej: /api/users/search?email=test@test.com)
router.get('/search/:email/:username', authenticate, userController.findUserByEmailOrUsername);

// CRUD estándar
router.get('/', authenticate, authorize(['admin']), userController.getAllUsers); // Solo admin ve lista completa
router.get('/:id', authenticate, userController.findUserById);

router.post(
    '/', 
    ...CreateUserValidator, 
    validateDTO, 
    userController.create
);

router.put(
    '/:id', 
    authenticate, 
    ...UpdateUserValidator, 
    validateDTO, 
    userController.updateUser
);

router.delete(
    '/:id', 
    authenticate, 
    authorize(['admin']), 
    userController.deleteUser
);

export default router;
