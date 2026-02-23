import { Router } from 'express';
import * as petController from '../controllers/pets.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router: Router = Router();

// Registrar mascota (POST /api/mascotas)
// El authenticate es CLAVE para que req.user.id no sea undefined
router.post('/', authenticate, petController.createPet);

// Ver mis mascotas (GET /api/mascotas/mis-mascotas)🐾
router.get('/mis-mascotas', authenticate, petController.getMyPets);

// SOLO STAFF puede ver TODAS las mascotas (GET /api/mascotas) 🛡️
router.get('/', authenticate, authorize(['vet', 'admin']), petController.getAllPets);

// SOLO STAFF puede editar (PUT) 🛡️
router.put('/:id', authenticate, authorize(['vet', 'admin']), petController.updatePet);

// SOLO ADMIN puede borrar (DELETE) 🛑
router.delete('/:id', authenticate, authorize(['admin']), petController.deletePet);








export default router;
