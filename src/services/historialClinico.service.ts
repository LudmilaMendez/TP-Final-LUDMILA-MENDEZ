import { HistorialClinico, IHistorialClinico } from "../models/historialClinico.model";
import { CreateHistorialDTO, HistorialResponseDTO } from "../types/historial";

const mapToResponseDTO = (record: any): HistorialResponseDTO => {
    return {
        id: record._id.toString(),
        petId: record.petId, 
        // 🛡️ SEGURIDAD: Verificamos si es objeto (poblado) o string (recién guardado)
        vetId: (record.vetId && record.vetId.username) 
        ? record.vetId.username 
        : record.vetId.toString(),
        description: record.description,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        date: record.date,
        createdAt: record.createdAt
    };
};


// 1. Crear Historial (Veterinarios/Admins) - El vetId se asigna automáticamente desde el token JWT para evitar suplantaciones de identidad
export const createRecord = async (data: CreateHistorialDTO & { vetId: string }): Promise<HistorialResponseDTO> => {
    const newRecord = new HistorialClinico(data);
    const savedRecord = await newRecord.save();
    // Traemos los datos del veterinario (Dra. Garcia, Dr. Perez, etc.) 
    // para que el mapToResponseDTO pueda leer el .username
    await savedRecord.populate('vetId', 'username email');
    
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

//4. Editar un historial (Solo para Veterinarios/Admins). NO HACE FALTA que si o si sea el vet que lo atendio antes, porque queda asentado quien hizo la nueva consulta
export const updateRecord = async (id: string, data: Partial<CreateHistorialDTO>): Promise<HistorialResponseDTO | null> => {
    // Al hacer update, volvemos a poblar vetId para que el mapeo no falle
    const updated = await HistorialClinico.findByIdAndUpdate(id, data, { new: true })
        .populate('vetId', 'username email');
    return updated ? mapToResponseDTO(updated) : null;
};

//5. Eliminar un historial (Solo para Admins)
export const deleteRecord = async (id: string): Promise<HistorialResponseDTO | null> => {
    const deleted = await HistorialClinico.findByIdAndDelete(id);
    return deleted ? mapToResponseDTO(deleted) : null;
};
