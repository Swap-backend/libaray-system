import express from "express";
import {
  getSystemReport,
  getOverdueBooks,
  getFinesCollected,
} from "../controller/reports.controller.js";
import authenticate from "../middleware/auth.admin.middleware.js";

const router = express.Router();

router.post("/system", authenticate, getSystemReport);
router.post("/overdue", authenticate, getOverdueBooks);
router.post("/fines", authenticate, getFinesCollected);

export default router;
