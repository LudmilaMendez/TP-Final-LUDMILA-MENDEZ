
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
    ownerName: string; //Quiero que en la seccion de Staff se vea el nombre del dueño, no solo el ID
    createdAt: Date;
}
