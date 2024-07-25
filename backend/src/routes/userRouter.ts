// routes/userRoutes.ts
import express from "express";
import {
  deleteUser,
  getCurrentUser,
  getUserById,
  getUsers,
  signinUser,
  signupUser,
  updateUser,
  updateUserProfile,
} from "../controllers/userController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { AdminMiddleware } from "../middleware/AdminMiddleware";

export const userRouter = express.Router();

userRouter.post("/signin", signinUser);
userRouter.post("/signup", signupUser);
userRouter.put("/profile", AuthMiddleware, updateUserProfile);
userRouter.get("/", AuthMiddleware, AdminMiddleware, getUsers);
userRouter.get("/current", AuthMiddleware, getCurrentUser);
userRouter.get("/:id", AuthMiddleware, AdminMiddleware, getUserById);
userRouter.put("/:id", AuthMiddleware, AdminMiddleware, updateUser);

userRouter.delete("/:id", AuthMiddleware, AdminMiddleware, deleteUser);
