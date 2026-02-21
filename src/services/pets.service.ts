import { Pet, IPet } from "../models/pets.model";
import { CreatePetDTO, PetResponseDTO } from "../types/pets";

const mapToResponseDTO = (pet: IPet): PetResponseDTO => {
    return {
        id: (pet._id as any).toString(),
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        // CORRECCIÓN: Si está poblado sacamos el _id, si no, lo usamos directo
        ownerId: (pet.ownerId as any)._id ? (pet.ownerId as any)._id.toString() : pet.ownerId.toString(),
        createdAt: pet.createdAt
    };
};

export const getAllPets = async (): Promise<PetResponseDTO[]> => {
    // .populate('ownerId', 'username email') trae los datos del dueño
    const pets = await Pet.find().populate('ownerId', 'username email');
    return pets.map(mapToResponseDTO);
};

export const getPetById = async (id: string): Promise<PetResponseDTO | null> => {
    const pet = await Pet.findById(id).populate('ownerId', 'username email');
    return pet ? mapToResponseDTO(pet) : null;
};

export const createPet = async (data: CreatePetDTO): Promise<PetResponseDTO> => {
    const newPet = new Pet(data);
    const savedPet = await newPet.save();
    return mapToResponseDTO(savedPet);
};

export const updatePet = async (id: string, data: Partial<CreatePetDTO>): Promise<PetResponseDTO | null> => {
    const pet = await Pet.findByIdAndUpdate(id, data, { new: true });
    return pet ? mapToResponseDTO(pet) : null;
};

export const deletePet = async (id: string): Promise<PetResponseDTO | null> => {
    const pet = await Pet.findByIdAndDelete(id);
    return pet ? mapToResponseDTO(pet) : null;
};

// Función extra: Buscar todas las mascotas de un solo dueño
export const getPetsByOwner = async (ownerId: string): Promise<PetResponseDTO[]> => {
    const pets = await Pet.find({ ownerId });
    return pets.map(mapToResponseDTO);
};
