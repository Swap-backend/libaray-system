// controllers/auth.controller.ts
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const generateAccessToken = (user: any) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("JWT_SECRET is required");

  return jwt.sign(
    {
      id: user.id,
      userName: user.userName,
      email: user.email,
      contact: user.contact,
      status: user.status,
      role: user.role,
    },
    jwtSecret,
    { expiresIn: "1h" }
  );
};

export const register = async (req: Request, res: Response) => {
  const { userName, email, password, contact, address, role } = req.body;

  if (!userName || !email || !password || !contact || !address) {
    return res.status(400).json({ success: false, message: "All required fields must be provided" });
  }

  // Optional: Validate role, only allow "admin" or "user"
  const validRoles = ["admin", "user"];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role provided" });
  }

  try {
    if (await User.findOne({ where: { email } })) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }
    if (await User.findOne({ where: { contact } })) {
      return res.status(400).json({ success: false, message: "Contact already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
      contact,
      address,
      status: 1,
      otp,
      role: role || "user",  // <-- Use role from request or default to "user"
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully. OTP generated.",
      data: {
        id: newUser.id,
        email: newUser.email,
        contact: newUser.contact,
        otp,
        role: newUser.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error", error: (err as Error).message });
  }
};


export const verifyOtp = async (req: Request, res: Response) => {
  const { contact, otp } = req.body;
  if (!contact || !otp) {
    return res.status(400).json({ success: false, message: "Contact and OTP required" });
  }

  try {
    const user = await User.findOne({ where: { contact } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    await user.save();

    const token = generateAccessToken(user);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully. User is now verified.",
      accessToken: token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        contact: user.contact,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: (err as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { contact, password } = req.body;
  if (!contact || !password) {
    return res.status(400).json({ success: false, message: "Contact and password required" });
  }

  try {
    const user = await User.findOne({ where: { contact } });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Please verify OTP before login" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateAccessToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken: token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
        contact: user.contact,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: (err as Error).message });
  }
};
