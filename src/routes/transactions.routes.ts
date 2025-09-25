import express from "express";
import {
    borrowBook,
    returnBook,
    getTransactions,
} from "../controller/transactions.controller.js";

import authenticateUser from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/list", authenticateUser, getTransactions);
router.post("/borrow", authenticateUser, borrowBook);
router.post("/return/:id", authenticateUser, returnBook);

export default router;
