
export interface CreateUserDTO {
    username: string;
    email: string;
    password: string;
    phone: string;
    role?: string;
}
export interface UpdateUserDTO extends Partial<CreateUserDTO> { }

export interface UpdateUserDTO extends Partial<CreateUserDTO> { }

export interface UserResponseDTO {
    id: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}