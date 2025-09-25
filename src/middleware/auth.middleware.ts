import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const headerValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  const token = typeof headerValue === "string" && headerValue.startsWith("Bearer ")
    ? headerValue.slice(7)
    : headerValue;

  if (!token) return res.status(401).json({ message: "Unauthorized: Token missing" });

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
 
    console.error("JWT_SECRET environment variable not set");
    return res.status(500).json({ message: "Internal server error" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticate;
