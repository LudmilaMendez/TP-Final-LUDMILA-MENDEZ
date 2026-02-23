// Equivalente al POOL DE CONEXIONES DE MYSQL

import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_URI =
process.env.MONGODB_URI || 'mongodb+srv://luly:patitasfelices@cluster1.knrfuiq.mongodb.net/Patitas-Felices'

console.log("DEBUG: La URI leída es:", process.env.MONGODB_URI);


export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB conectado exitosamente');
    } catch (error) {
        console.error('❌ Error al conectar MongoDB:', error);
        process.exit(1);
    }
};

// Manejar eventos de conexión
mongoose.connection.on('error', (err) => {
    console.error('❌ Error de MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB desconectado');
});