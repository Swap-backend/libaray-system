import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  // Token can be in format: "Bearer <token>", so let's extract token properly
  // const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  const token = req.headers["authorization"];

  if (!token) return res.status(401).json({ message: "Unauthorized: Token missing" });

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    // If JWT_SECRET not set, this is a server config error
    console.error("JWT_SECRET environment variable not set");
    return res.status(500).json({ message: "Internal server error" });
  }

  try {
    const decoded:any = jwt.verify(token, jwtSecret);
    if(decoded?.role == "admin"){
      (req as any).user = decoded;
      next();
    } else {
      return res.status(403).json({
        status: 'error',
        meessage: "You are not a admin !!!"
      })
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticate;
