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

router.get("/", authenticateUser, getAllUsers);
router.get("/:id", authenticateUser, getUserById);
router.put("/:id", authenticateUser, updateUser);
router.delete("/:id", authenticateUser, deleteUser);

export default router;
