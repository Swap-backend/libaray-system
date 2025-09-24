import type { Request, Response } from "express";
import User from "../models/user.model.js";


export const getProfile = async (req: Request, res: Response) => {
  const id = (req as any).user?.id;
  console.log((req as any).user)
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to fetch user" });
  }
}


export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.findAll();
    return res.status(200).json({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to fetch users" });
  }
};


export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to fetch user" });
  }
};


export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { userName, email, password } = req.body;

    if (!userName && !email && !password) {
      return res.status(400).json({ message: "At least one field must be provided to update." });
    }

    if (userName) user.userName = userName;
    if (email) user.email = email;
    if (password) user.password = password; // Password should be hashed

    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to update user" });
  }
};


export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Failed to delete user" });
  }
};
