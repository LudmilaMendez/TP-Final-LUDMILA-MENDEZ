export interface JwtPayload {
    id: string; // Cambia de number a string (ObjectId de MongoDB)
    username: string;
    role: UserRole;
}

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    VET = 'vet'
}