import { HistorialClinico, IHistorialClinico } from "../models/historialClinico.model";
import { CreateHistorialDTO, HistorialResponseDTO } from "../types/historial";

const mapToResponseDTO = (record: any): HistorialResponseDTO => {
    return {
        id: record._id.toString(),
        // Si petId es un objeto (porque hubo populate), lo devolvemos tal cual o su ID
        petId: record.petId, 
        vetId: record.vetId,
        description: record.description,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        date: record.date,
        createdAt: record.createdAt
    };
};

// 1. Crear Historial (Solo el Veterinario)
export const createRecord = async (data: CreateHistorialDTO & { vetId: string }): Promise<HistorialResponseDTO> => {
    const newRecord = new HistorialClinico(data);
    const savedRecord = await newRecord.save();
    return mapToResponseDTO(savedRecord);
};

// 2. Ver todos los historiales de una Mascota específica
export const getRecordsByPet = async (petId: string): Promise<HistorialResponseDTO[]> => {
    const records = await HistorialClinico.find({ petId })
        .populate('petId', 'name species') // Trae datos de mascota
        .populate('vetId', 'username email'); // Trae datos del veterinario
    return records.map(mapToResponseDTO);
};

// 3. Ver todos los historiales (para el Admin o Veterinaria general)
export const getAllRecords = async (): Promise<HistorialResponseDTO[]> => {
    const records = await HistorialClinico.find()
        .populate('petId', 'name')
        .populate('vetId', 'username');
    return records.map(mapToResponseDTO);
};
