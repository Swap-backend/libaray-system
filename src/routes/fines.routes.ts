import express from "express";
import {
  getMyFines,
  getAllFines,
  payFine,
  waiveFine,
  addManualFine,
} from "../controller/fines.controller.js";

import authenticateUser from "../middleware/auth.middleware.js";
import authenticateAdmin from "../middleware/auth.admin.middleware.js";

const router = express.Router();

router.post("/my-fines", authenticateUser, getMyFines);
router.post("/list", authenticateAdmin, getAllFines);
router.post("/pay/:fineId", authenticateUser, payFine);
router.post("/waive/:fineId", authenticateAdmin, waiveFine);
router.post("/add", authenticateAdmin, addManualFine);

export default router;
