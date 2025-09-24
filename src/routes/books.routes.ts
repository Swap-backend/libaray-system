import express from "express";
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../controller/books.controller.js";

const router = express.Router();


router.post("/list", getAllBooks);
router.post("/add", createBook);
router.post("/update/:id", updateBook);
router.post("/delete/:id", deleteBook);

export default router;
