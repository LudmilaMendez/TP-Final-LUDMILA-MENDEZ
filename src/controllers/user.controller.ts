import { Request, Response } from 'express';
import * as userService from '../services/users.service';
import { CreateUserDTO, UpdateUserDTO } from '../types/users';

export const findUserByEmailOrUsername = async (req: Request, res: Response) => {
    const { email, username } = req.params as { email: string; username: string };
    try {
        const user = await userService.findUserByEmailOrUsername(email, username);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar el usuario", error });
    }
};

export const findUserById = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }; 
    
    try {
        const user = await userService.getUserById(id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Error al buscar por ID", error });
    }
};

export const create = async (req: Request, res: Response) => {
    try {
        const userData = req.body as CreateUserDTO;
        const newUser = await userService.createUser(userData);
        return res.status(201).json(newUser);
    } catch (error) {
        return res.status(500).json({ error: 'Error al crear usuario', detail: error });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener usuarios", error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    
    const { id } = req.params as { id: string }; 
    
    try {
        const updatedUser = await userService.updateUser(id, req.body as UpdateUserDTO);
        if (!updatedUser) return res.status(404).json({ message: "Usuario no encontrado" });
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar usuario", error });
    }
};


export const deleteUser = async (req: Request, res: Response) => {

    const { id } = req.params as { id: string }; 
    try {
        const deletedUser = await userService.deleteUser(id);
        if (!deletedUser) return res.status(404).json({ message: "Usuario no encontrado" });
        return res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar usuario", error });
    }
};
