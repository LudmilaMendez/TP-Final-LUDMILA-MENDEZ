import { Request, Response } from 'express';
import * as historialService from '../services/historialClinico.service';
import * as petService from '../services/pets.service';

// 1. Crear Registro Médico (Solo Veterinarios/Admins)
export const createRecord = async (req: Request, res: Response) => {
    try {
        const { petId, description, diagnosis, treatment } = req.body;
        const vetId = (req as any).user.id; 

        const recordData = { petId, description, diagnosis, treatment, vetId };

        const newRecord = await historialService.createRecord(recordData);
        return res.status(201).json(newRecord);
    } catch (error) {
        return res.status(500).json({ message: "Error al crear el historial clínico", error });
    }
};

// 2. Ver historial por Mascota (CON FILTRO DE SEGURIDAD)
export const getByPet = async (req: Request, res: Response) => {
    try {
        const { petId } = req.params as { petId: string };
        const userId = (req as any).user.id.toString(); 
        const userRole = (req as any).user.role;

        // Buscamos la mascota para verificar quién es el dueño
        const pet = await petService.getPetById(petId);
        
        if (!pet) {
            return res.status(404).json({ message: "Mascota no encontrada" });
        }

        // Validación: Si es un usuario común, debe ser el dueño
                    // ... (buscamos la mascota arriba) ...
            if (userRole === 'user' && pet.ownerId !== userId) {
            return res.status(403).json({ message: "No tenés permiso para ver este historial" });
        }


        // Si pasó el filtro (o es Vet/Admin), devuelve los registros
        const records = await historialService.getRecordsByPet(petId);
        return res.status(200).json(records);

    } catch (error) {
        console.error("DETALLE DEL ERROR:", error);
        return res.status(500).json({ message: "Error al obtener historial", error });
    }
};

// 3. Ver todos los registros
export const getAll = async (req: Request, res: Response) => {
    try {
        const records = await historialService.getAllRecords();
        return res.status(200).json(records);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener todos los registros", error });
    }
};
