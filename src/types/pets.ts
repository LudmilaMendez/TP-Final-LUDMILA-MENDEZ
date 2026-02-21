
export interface CreatePetDTO {
    name: string;
    species: string;
    breed?: string;
    age: number;
    ownerId: string; // El ID del usuario/dueño
}

export interface PetResponseDTO {
    id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    ownerId: string;
    createdAt: Date;
}
