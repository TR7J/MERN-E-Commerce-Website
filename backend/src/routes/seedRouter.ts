import express from "express";
import { seedDatabase } from "../controllers/seedController";

export const seedRouter = express.Router();

// /api/seed
seedRouter.get("/", seedDatabase);
