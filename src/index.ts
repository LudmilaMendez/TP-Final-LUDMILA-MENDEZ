import 'dotenv/config';
import express, { Request, Response } from 'express';


import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Recrear __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import { connectDB } from './config/database'; //! CUANDO SE HACE DECLARACION DE QUE EL SERVIDOR SE VA A CONECTAR A MONGODB, con la Promise, EL SERVIDOR NO VA A ESTAR LISTO HASTA QUE LA CONEXION NO ESTE HECHA. POR ESO DEFINIMOS CONNECTDB Y LUEGO LO IMPORTAMOS.
import authRoutes from './routes/auth.route';
import petsroutes from './routes/pets.route'; // IMPORTAMOS LAS RUTAS DE MASCOTAS
import historialroutes from './routes/historialClinico.route'; // IMPORTAMOS LAS RUTAS DE HISTORIAL CLINICO
import { authenticate, authorize } from './middlewares/auth.middleware';
import { AppError } from './types/appError';
import { errorHandler } from './middlewares/error.middleware';
import { UserRole } from './types/auth';
import userRoutes from './routes/users.route'; // IMPORTAMOS LAS RUTAS DE USUARIOS

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a MongoDB
//connectDB();   //!ESTO LO TUVE QUE COMENTAR PORQUE ME MOSTRABA EL MENSAJE DE CONEXION EXITOSA 2 VECES

// Middleware para interpretar JSON
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, '..', 'public')));

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Ruta pública
app.get('/public', (req: Request, res: Response) => {
    res.json({
        message: 'Cualquiera puede entrar!',
    });
});

// Ruta protegida (requiere autenticación)
app.get('/protected', authenticate, (req, res) => {
    res.json({
        message: 'Acceso permitido',
    });
});

// Ruta de administrador (requiere autenticación y rol admin)
app.get('/admin', authenticate, authorize(['admin']), (req, res) => {
    res.json({
        message: 'Acceso de administrador permitido',
    });
});

app.get('/api/saludo', (req: Request, res: Response) => {
    res.json({ mensaje: 'Hola desde la API 🚀' });
});

app.use('/api/users', userRoutes); //en users.model el role define si es user (dueno), vet o admin


app.use('/api/mascotas' , petsroutes);

app.use('/api/historial', historialroutes);
 //! IMPORTAMOS LAS RUTAS DE HISTORIAL CLINICO
app.get('/test-error', (req,res, next) => {
next(new AppError('Este es un error de prueba!', 418))
});

app.use(errorHandler)
//! CONECTAR A MONGODB Y LUEGO INICIAR EL SERVIDOR
connectDB().then (()=> {  //! CUANDO EFECTIVAMENTE SE CONECTE (y then, termine la accion de conectar)
    app.listen(PORT, () => {  //! CORREMOS EL SERVIDOR
    console.log(`Servidor corriendo en http://localhost:${PORT} 🚀`); //! ASI LEVANTAMOS LA APP CUANDO MONGODB YA ESTE CONECTADO
});
});
