import { Router } from 'express';
import * as petController from '../controllers/pets.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router: Router = Router();

// Registrar mascota (POST /api/mascotas)
// El authenticate es CLAVE para que req.user.id no sea undefined
router.post('/', authenticate, petController.createPet);

// Ver mis mascotas
router.get('/mis-mascotas', authenticate, petController.getMyPets);

// Ver todas (podes agregar authorize(['admin', 'vet']) mas adelante)
router.get('/', authenticate, petController.getAllPets);

export default router;
