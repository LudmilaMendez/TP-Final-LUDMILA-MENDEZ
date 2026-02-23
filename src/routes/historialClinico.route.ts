import { Router } from 'express';
import * as historialController from '../controllers/historialClinico.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router: Router = Router();

// 1. Crear historia clínica (SOLO VETERINARIOS O ADMINS)
// Usamos authorize(['vet', 'admin']) para que un dueño no se auto-diagnostique
router.post(
    '/', 
    authenticate, 
    authorize(['vet', 'admin']), 
    historialController.createRecord
);

// 2. Ver historial de una mascota específica (Dueños, Vets y Admins)
router.get(
    '/mascota/:petId', 
    authenticate, 
    historialController.getByPet
);

// 3. Ver todos los historiales (Solo para control de la veterinaria)
router.get(
    '/', 
    authenticate, 
    authorize(['vet', 'admin']), 
    historialController.getAll
);

// 4.Editar: Veterinarios y Admin pueden corregir datos médicos 🩺
router.put(
    '/:id', 
    authenticate, 
    authorize(['vet', 'admin']), 
    historialController.updateRecord
);

// 5.Borrar: SÓLO EL ADMIN puede eliminar un registro del sistema 🛑
router.delete(
    '/:id', 
    authenticate, 
    authorize(['admin']), 
    historialController.deleteRecord
);

export default router;
