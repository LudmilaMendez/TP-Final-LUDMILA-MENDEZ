import { body } from 'express-validator';
import { ValidationChain } from 'express-validator';

export const validatePassword: ValidationChain[] = [
    body('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/\d/)
        .withMessage('La contraseña debe contener al menos un número')
        .matches(/[A-Z]/)
        .withMessage('La contraseña debe contener al menos una mayúscula')
        .matches(/[^A-Za-z0-9]/)
        .withMessage('La contraseña debe contener al menos un carácter especial'),
];

export const validateEmail: ValidationChain[] = [
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
];

export const validatePhone: ValidationChain[] = [
    body('phone')
        .notEmpty().withMessage('El teléfono es requerido')
        .isString().withMessage('El teléfono debe ser una cadena de texto')
        .isLength({ min: 7, max: 15 }).withMessage('El teléfono debe tener entre 7 y 15 dígitos')
        // Opcional: Regex para que solo acepte números y el signo +
        .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/)
        .withMessage('El formato del teléfono no es válido')
];

export const registerValidator: ValidationChain[] = [
    ...validateEmail,
    ...validatePassword,
    ...validatePhone,
    body('username')
        .isLength({ min: 3 })
        .withMessage('Username debe tener al menos 3 caracteres')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage(
            'Username solo puede contener letras, números y guiones bajos'
        ),
];

export const loginValidator: ValidationChain[] = [
    ...validateEmail,
    body('password').notEmpty().withMessage('La contraseña es requerida'),
];