import bcrypt from 'bcryptjs';
import * as userModel from '../models/users.model';
import jwt, { SignOptions } from 'jsonwebtoken';
import { JwtPayload, UserRole } from '../types/auth';


export const register = async (
    username: string,
    email: string,
    password: string,
    phone: string,
    role: UserRole
): Promise<string> => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser({
        username,
        email,
        password: hashedPassword,
        phone,
        role,
    });
    return userId;
};

export const login = async (
    email: string,
    password: string
): Promise<string> => {
    // 1. Validamos la existencia de la KEY aquí adentro
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        console.error("❌ ERROR: JWT_SECRET no encontrado en .env");
        throw new Error('Error interno de configuración');
    }

    const invalidCredentialsError = new Error('Credenciales inválidas');

    const user = await userModel.findUser(email);
    if (!user) throw invalidCredentialsError;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw invalidCredentialsError;

    const payload: JwtPayload = {
        id: user.id,
        username: user.username,
        role: user.role as UserRole,
    };

    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN as any) || '1h',
        issuer: 'curso-utn-backend',
    };

    return jwt.sign(payload, secretKey, options);
};
