import { Request, Response } from 'express';
import * as petService from '../services/pets.service';
import { CreatePetDTO } from '../types/pets';

// 1. Crear Mascota (Automático por Token)
export const createPet = async (req: Request, res: Response) => {
    try {
        const { name, species, breed, age, ownerId } = req.body;
        const userRole = (req as any).user.role;
        const userId = (req as any).user.id;

        // LÓGICA DE ASIGNACIÓN:
        // Si es un usuario común, siempre es dueño de lo que crea.
        // Si es Staff/Admin, usa el ownerId que mandamos desde el formulario.
        const finalOwnerId = userRole === 'user' ? userId : ownerId;

        const petData: CreatePetDTO = {
            name,
            species,
            breed: breed || 'Mestizo', 
            age,
            ownerId: finalOwnerId
        };

        const newPet = await petService.createPet(petData);
        return res.status(201).json(newPet);
    } catch (error) {
        return res.status(500).json({ message: "Error al registrar la mascota", error });
    }
};


// 2. Ver solo MIS mascotas gracias al ownerId del token
export const getMyPets = async (req: Request, res: Response) => {
    try {
        const ownerId = (req as any).user.id;
        const pets = await petService.getPetsByOwner(ownerId);
        return res.status(200).json(pets);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener tus mascotas", error });
    }
};

// 3. Ver TODAS las mascotas (Útil para el Veterinario)
export const getAllPets = async (req: Request, res: Response) => {
    try {
        const pets = await petService.getAllPets();
        return res.status(200).json(pets);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener todas las mascotas", error });
    }
};

// 4. Buscar una por ID
export const getPetById = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    try {
        const pet = await petService.getPetById(id);
        if (!pet) return res.status(404).json({ message: "Mascota no encontrada" });
        return res.status(200).json(pet);
    } catch (error) {
        return res.status(500).json({ message: "Error al buscar mascota", error });
    }
};

// 5. Actualizar Mascota (Solo para Staff/Admin)
export const updatePet = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    try {
        const updatedPet = await petService.updatePet(id, req.body);
        if (!updatedPet) {
            return res.status(404).json({ message: "Mascota no encontrada para actualizar" });
        }
        return res.status(200).json(updatedPet);
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar la mascota", error });
    }
};

// 6. Eliminar Mascota (Solo para Admin)
export const deletePet = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    try {
        const deletedPet = await petService.deletePet(id);
        if (!deletedPet) {
            return res.status(404).json({ message: "Mascota no encontrada para eliminar" });
        }
        return res.status(200).json({ message: "Mascota eliminada correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar la mascota", error });
    }
};
