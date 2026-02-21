import mongoose, { Schema, Document } from 'mongoose';

export interface IHistorialClinico extends Document {
    petId: mongoose.Types.ObjectId;   // A qué mascota atendimos
    vetId: mongoose.Types.ObjectId;   // Qué veterinario la atendió (un User con role 'vet')
    description: string;               // Motivo de consulta / Síntomas
    diagnosis: string;                 // Diagnóstico médico
    treatment: string;                 // Medicación o pasos a seguir
    date: Date;                        // Fecha de consulta
    createdAt: Date;                   // Fecha de creación del registro
}

const historialClinicoSchema = new Schema<IHistorialClinico>({
    petId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Pet', 
        required: true 
    },
    vetId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    description: { type: String, required: true },
    diagnosis: { type: String, required: true },
    treatment: { type: String, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

export const HistorialClinico = mongoose.model<IHistorialClinico>('HistorialClinico', historialClinicoSchema);
