import express from "express";
import {
  getAllUsers,
  getUserById,
  // createUser,
  updateUser,
  deleteUser,
  getProfile,
} from "../controller/user.controller.js";

import authenticate from "../middleware/auth.admin.middleware.js";
import authenticateUser from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", authenticateUser, getProfile)

router.get("/", authenticate, getAllUsers);
router.get("/:id", authenticate, getUserById);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, deleteUser);

export default router;
