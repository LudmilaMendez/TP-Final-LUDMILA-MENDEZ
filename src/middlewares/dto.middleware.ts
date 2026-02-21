import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../types/appError';

export const validateDTO = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) { //SI ESTA VACIA ESTA TODO OK
        // Mapeamos los errores para crear un mensaje legible
        const message = errors.array().map(err => err.msg).join(', '); //.MAP PARA QUE EL USUARIO SOLO VEA EL MENSAJE DE ERROR Y JOIN PARA JUNTAR LOS ERRORES EN UNA ORACION SI HAY +1
        
        // Usamos clase AppError
        return next(new AppError(`Error de validación: ${message}`, 400));
    }
    
    next();
};
