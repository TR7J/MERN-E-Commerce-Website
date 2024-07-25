import { Request, Response, NextFunction } from "express";
import { sampleProducts, sampleUsers } from "../data";
import Product from "../models/Product";
import User from "../models/User";

export const seedDatabase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(sampleProducts);

    await User.deleteMany({});
    const createdUsers = await User.insertMany(sampleUsers);
    res.json({ createdProducts, createdUsers });
  } catch (error) {
    next(error);
  }
};
