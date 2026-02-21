import {Request, Response, NextFunction} from 'express';
import {AppError} from '../types/appError';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
    // Usamos 'as AppError' para asegurar el acceso a statusCode, porque typescript no lo reconocia 
    const appErr = err as AppError; 
    return res.status(appErr.statusCode).json({
        status: 'error',
        message: appErr.message,
    });
}
    // Error de Mongoose (ID invalido)
    if (err.name === 'CatError') {
        return res.status(400).json({
            status:'error',
            message:'ID invalido',
        });
    }
    //Error de validacion
    if (err.name === 'ValidationError') {
        return res.status(400).json ({
            status: 'error',
            message: err.message,
        })
    }
    //Error de duplicado en MONGODB
    if ((err as any).code === 11000){
        return res.status(400).json({
            status: 'error',
            message: 'Valor duplicado en la Base de Datos',
        })
    }
    //Errores Inesperados
    console.error ('ERROR:', err);
    return res.status(500).json({
        status: 'error',
        message: 'Algo salio mal en el servidor',
    });
};