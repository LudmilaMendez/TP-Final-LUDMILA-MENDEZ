import mongoose, { Schema, Document } from 'mongoose';

export interface IPet extends Document {
    name: string;
    species: string;
    breed: string;   // Raza
    age: number;
    ownerId: mongoose.Types.ObjectId; // Relación con Users
    createdAt: Date;
}

const petSchema = new Schema<IPet>({
    name: { type: String, required: true, trim: true },
    species: { type: String, required: true },
    breed: { type: String, default: 'Mestizo' },
    age: { type: Number, required: true },
    ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User', //relacion mascota-dueno
    required: true
}
}, { timestamps: true });

export const Pet = mongoose.model<IPet>('Pet', petSchema);
