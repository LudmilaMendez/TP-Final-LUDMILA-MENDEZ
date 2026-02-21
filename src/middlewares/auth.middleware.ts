import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload, UserRole } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET as string;

/**
 * Middleware de autenticación
 *
 * Verifica que el token sea válido y lo almacena en req.user
 */
export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token or expired' });
        }
        req.user = decoded as JwtPayload;
        next();
    });
};

/**
 * Middleware de autorización
 *
 * Verifica que el usuario tenga uno de los roles permitidos
 */
export const authorize = (roles: Array<UserRole | string>) => { 
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        next();
    };
};