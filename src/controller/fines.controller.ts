import type { Request, Response } from "express";
import Fine from "../models/fine.model.js";
import User from "../models/user.model.js";

interface AuthUser { id: number; role: "admin" | "user"; }
interface AuthRequest extends Request { user?: AuthUser }


export const getMyFines = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const fines = await Fine.findAll({
      where: { userId: req.user.id },
      order: [["issuedAt", "DESC"]],
    });

    return res.status(200).json({ success: true, fines });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch fines", error: (error as Error).message });
  }
};


export const getAllFines = async (_req: Request, res: Response) => {
  try {
    const fines = await Fine.findAll({
      include: [{ model: User, as: "user", attributes: ["userName", "email", "contact"] }],
      order: [["issuedAt", "DESC"]],
    });

    return res.status(200).json({ success: true, fines });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch all fines", error: (error as Error).message });
  }
};


export const payFine = async (req: Request, res: Response) => {
  const fineId = req.params.fineId;

  try {
    const fine = await Fine.findByPk(fineId);
    if (!fine) {
      return res.status(404).json({ success: false, message: "Fine not found" });
    }

    if (fine.isPaid) {
      return res.status(400).json({ success: false, message: "Fine already paid" });
    }

    fine.isPaid = true;
    fine.paidAt = new Date();
    await fine.save();

    return res.status(200).json({ success: true, message: "Fine paid successfully", fine });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to pay fine", error: (error as Error).message });
  }
};


export const waiveFine = async (req: Request, res: Response) => {
  const fineId = req.params.fineId;

  try {
    const fine = await Fine.findByPk(fineId);
    if (!fine) {
      return res.status(404).json({ success: false, message: "Fine not found" });
    }

    await fine.destroy();
    return res.status(200).json({ success: true, message: "Fine waived (deleted) successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to waive fine", error: (error as Error).message });
  }
};


export const addManualFine = async (req: Request, res: Response) => {
  const { userId, amount, reason } = req.body;

  if (!userId || !amount || !reason) {
    return res.status(400).json({ success: false, message: "userId, amount, and reason are required" });
  }

  try {
    const fine = await Fine.create({
      userId,
      amount,
      reason,
      isPaid: false,
      issuedAt: new Date(),
    });

    return res.status(201).json({ success: true, message: "Fine created manually", fine });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create fine", error: (error as Error).message });
  }
};
