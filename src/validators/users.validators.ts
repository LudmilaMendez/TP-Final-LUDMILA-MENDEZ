import { body, ValidationChain } from 'express-validator';

const username: ValidationChain = body('username')
    .optional()
    .isString()
    .withMessage('El nombre debe ser una cadena de texto')
    .isLength({ max: 50 })
    .withMessage('El nombre no puede exceder los 50 caracteres');

    
const email: ValidationChain = body('email')
            .isEmail()
            .withMessage('Debe ser un email válido')
            .normalizeEmail();

export const CreateUserValidator: ValidationChain[] = [
    body('username').notEmpty().withMessage('El username es obligatorio').isLength({ min: 3 }),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
];

export const UpdateUserValidator: ValidationChain[] = [
    username,
    email
];