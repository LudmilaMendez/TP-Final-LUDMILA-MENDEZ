
import { User, IUser } from "../models/users.model";
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from "../types/users";

const mapToResponseDTO = (user: IUser): UserResponseDTO => {
    return {
        username: user.username,
        email: user.email,
        phone: user.phone,
        // No incluimos la contraseña en la respuesta
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};

export const getAllUsers = async (): Promise<UserResponseDTO[]> => {
    const users = await User.find();
    return users.map(mapToResponseDTO);
}

export const getUserById = async (id: string): Promise<UserResponseDTO | null> => {
    const user = await User.findById(id);
    return user ? mapToResponseDTO(user) : null;
}

export const findUserByEmailOrUsername = async (email: string, username: string): Promise<UserResponseDTO | null> => {
    const user = await User.findOne({ $or: [{ email }, { username }] });
    return user ? mapToResponseDTO(user) : null;
}

export const createUser = async (data: CreateUserDTO): Promise<UserResponseDTO> => {
    const newUser = new User(data); // Ya viene hasheada desde Auth
    const savedUser = await newUser.save();
    return mapToResponseDTO(savedUser);
}

export const updateUser = async (id: string, data: UpdateUserDTO): Promise<UserResponseDTO | null> => {
    const user = await User.findByIdAndUpdate(id, data, { new: true }); //new para que devuelva el objeto actualizado
    return user ? mapToResponseDTO(user) : null; //si mongo no encuentra el id, devuelve null
};

export const deleteUser = async (id: string): Promise<UserResponseDTO | null> => {
    const user = await User.findByIdAndDelete(id);
    return user ? mapToResponseDTO(user) : null;
}