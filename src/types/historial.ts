export interface CreateHistorialDTO {
    petId: string;      // ID de la mascota 
    description: string; // Síntomas que trae
    diagnosis: string;   // Qué tiene
    treatment: string;   // Qué medicación le damos
}

export interface HistorialResponseDTO {
    id: string;
    petId: any;         
    vetId: any;         
    description: string;
    diagnosis: string;
    treatment: string;
    date: Date;
    createdAt: Date;
}
