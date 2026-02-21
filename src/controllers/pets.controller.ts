import { Request, Response } from 'express';
import * as petService from '../services/pets.service';
import { CreatePetDTO } from '../types/pets';

// 1. Crear Mascota (Automático por Token)
export const createPet = async (req: Request, res: Response) => {
    try {
        const { name, species, breed, age } = req.body;
        
        // Sacamos el ID del dueño del token (inyectado por authenticate)
        const ownerId = (req as any).user.id; 

        const petData: CreatePetDTO = {
            name,
            species,
            breed,
            age,
            ownerId
        };

        const newPet = await petService.createPet(petData);
        return res.status(201).json(newPet);
    } catch (error) {
        return res.status(500).json({ message: "Error al registrar la mascota", error });
    }
};

// 2. Ver solo MIS mascotas
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

