// types/appError.ts
export class AppError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        
        // Esto asegura que el nombre de la clase sea AppError
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
