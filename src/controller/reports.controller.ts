import type { Request, Response } from "express";
import { Op } from "sequelize";
import db from "../models/index.js";
const { Book, User, Transaction, Fine } = db;


export const getSystemReport = async (_req: Request, res: Response) => {
  try {
    const totalBooks = await Book.count();
    const totalUsers = await User.count();
    const totalIssuedBooks = await Transaction.count({ where: { status: "borrowed" } });
    const totalFines = await Fine.sum("amount", { where: { isPaid: true } });

    return res.status(200).json({
      success: true,
      report: {
        totalBooks,
        totalUsers,
        totalIssuedBooks,
        totalFinesCollected: totalFines || 0,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to get system report",
      error: (err as Error).message,
    });
  }
};

export const getOverdueBooks = async (_req: Request, res: Response) => {
  try {
    const today = new Date();

    const overdueTransactions = await Transaction.findAll({
      where: {
        status: "borrowed",
        returnDate: {
          [Op.lt]: today,
        },
      },
      include: [
        {
          model: User,
          attributes: ["id", "userName", "email"],
        },
        {
          model: Book,
          attributes: ["id", "name", "author_name"], // Updated field names
        },
      ],
      order: [["returnDate", "ASC"]],
    });

    return res.status(200).json({
      success: true,
      data: overdueTransactions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to get overdue books",
      error: (err as Error).message,
    });
  }
};


export const getFinesCollected = async (_req: Request, res: Response) => {
  try {
    const paidFines = await Fine.findAll({
      where: { isPaid: true },
      include: [
        {
          model: User,
          as: "user",  // Important: Must match the alias in your association
          attributes: ["id", "userName", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: paidFines,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch fines collected report",
      error: (err as Error).message,
    });
  }
};
