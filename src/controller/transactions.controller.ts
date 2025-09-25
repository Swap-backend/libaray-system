import type { Request, Response } from "express";
import Transaction from "../models/transaction.model.js";
import db from "../models/index.js";
const { Book } = db;

interface AuthUser {
  id: number;
  role: "admin" | "user";
}

interface AuthRequest extends Request {
  user?: AuthUser;
}

export const borrowBook = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(400).json({ success: false, message: "bookId is required" });
  }

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    const existingBorrow = await Transaction.findOne({
      where: { userId, bookId, status: "borrowed" },
    });

    if (existingBorrow) {
      return res.status(400).json({ success: false, message: "You already borrowed this book" });
    }

    const transaction = await Transaction.create({
      userId,
      bookId,
      borrowDate: new Date(),
      status: "borrowed",
    });

    return res.status(201).json({ success: true, message: "Book borrowed", data: transaction });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error", error: (err as Error).message });
  }
};


export const returnBook = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(400).json({ success: false, message: "bookId is required" });
  }

  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const transaction = await Transaction.findOne({
      where: { userId, bookId, status: "borrowed" },
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: "No borrowed transaction found" });
    }

    transaction.status = "returned";
    transaction.returnDate = new Date();
    await transaction.save();

    return res.status(200).json({ success: true, message: "Book returned", data: transaction });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error", error: (err as Error).message });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const role = req.user?.role;

  try {
    if (role !== "admin" && !userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const transactions = await Transaction.findAll({
      where: role === "admin" ? {} : { userId: userId as number },
      include: [{ model: Book }],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal server error", error: (err as Error).message });
  }
};
