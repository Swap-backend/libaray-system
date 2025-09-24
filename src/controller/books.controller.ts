import type { Request, Response } from "express";
import { Op } from "sequelize";
import db from "../models/index.js";

const { Book } = db as any;

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      id,
      name,
      author,
      edition,
    } = req.body as Record<string, string | number>; // reading filters from body

    const where: any = {};

    if (id) {
      where.id = Number(id);
    }
    if (name) {
      where.name = { [Op.iLike]: `%${name}%` }; // 🔹 corrected
    }
    if (author) {
      where.author_name = { [Op.iLike]: `%${author}%` };
    }
    if (edition) {
      where.edition = { [Op.iLike]: `%${edition}%` };
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { rows, count } = await Book.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [["id", "DESC"]],
    });

    return res.json({
      total: count,
      page: Number(page),
      limit: Number(limit),
      data: rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: "Internal server error" });
  }
};


export const createBook = async (req: Request, res: Response) => {
  try {
    const {
      name,
      author_name,
      description,
      page_count,
      excerpt,
      publish_date,
      edition,
    } = req.body;

    const book = await Book.create({
      name,
      author_name,
      description,
      page_count,
      excerpt,
      publish_date,
      edition,
    });

    return res.status(201).json(book);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const updateBook = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const [updatedRows] = await Book.update(req.body, {
      where: { id },
    });
    if (updatedRows === 0) {
      return res.status(404).json({ error: "Book not found or nothing to update" });
    }
    const updatedBook = await Book.findByPk(id);
    return res.json(updatedBook);
  } catch (err) {
    return res.status(400).json({ error: "Internal server error" });
  }
};


export const deleteBook = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const deleted = await Book.destroy({
      where: { id },
    });
    if (!deleted) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
