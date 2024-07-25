import { Request, Response, NextFunction } from "express";

export const getPaypalClientID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json({ clientId: process.env.PAYPAL_CLIENT_ID || "sb" });
  } catch (error) {
    next(error);
  }
};
