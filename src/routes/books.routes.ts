import express from "express";
import {
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../controller/books.controller.js";

import authenticate from "../middleware/auth.admin.middleware.js";
import authenticateUser from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/list", authenticateUser, getAllBooks);
router.post("/add", authenticate, createBook);
router.post("/update/:id", authenticate, updateBook);
router.post("/delete/:id", authenticate, deleteBook);

export default router;
