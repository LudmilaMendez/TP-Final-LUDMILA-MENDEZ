import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { validationResult } from 'express-validator';

export const register = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, phone, role} = req.body;
        await authService.register(username, email, password, phone, role);

        return res.status(201).json({ message: 'Usuario creado exitosamente' });
    } catch (error: any) {
        console.error("DETALLE DEL ERROR EN REGISTER:", error); 
        // MongoDB devuelve error code 11000 para duplicados
        if (error.code === 11000) {
            return res.status(409).json({ error: 'El usuario o email ya existe' });
        }
        return res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        const token = await authService.login(email, password);

        return res.json({ token });
    } catch (error: any) {
        if (error.message === 'Credenciales inválidas') {
            return res.status(401).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};