import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const validateDTO = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next();
    }
    console.log("Errores de validación:", errors.array());
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export default validateDTO;