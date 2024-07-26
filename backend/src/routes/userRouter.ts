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
import { validateInput } from "../middleware/ValidatorsMiddleware";
import {
  signinUserSchema,
  signupUserSchema,
} from "../validators/userValidator";

export const userRouter = express.Router();

userRouter.post("/signin", validateInput(signinUserSchema), signinUser);
userRouter.post("/signup", validateInput(signupUserSchema), signupUser);
userRouter.put(
  "/profile",
  AuthMiddleware,
  validateInput(signupUserSchema),
  updateUserProfile
);
userRouter.get("/", AuthMiddleware, AdminMiddleware, getUsers);
userRouter.get("/current", AuthMiddleware, getCurrentUser);
userRouter.get("/:id", AuthMiddleware, AdminMiddleware, getUserById);
userRouter.put("/:id", AuthMiddleware, AdminMiddleware, updateUser);

userRouter.delete("/:id", AuthMiddleware, AdminMiddleware, deleteUser);
