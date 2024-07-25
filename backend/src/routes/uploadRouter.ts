import express from "express";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { AdminMiddleware } from "../middleware/AdminMiddleware";
import upload from "../middleware/upload";
import { uploadFileController } from "../controllers/uploadFileController";

const uploadRouter = express.Router();

uploadRouter.post(
  "/",
  AuthMiddleware,
  AdminMiddleware,
  upload.single("file"),
  uploadFileController
);
export default uploadRouter;
