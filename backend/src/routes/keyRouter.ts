import express from "express";
import { getPaypalClientID } from "../controllers/keyController";

export const keyRouter = express.Router();
// /api/keys/paypal
keyRouter.get("/paypal", getPaypalClientID);
