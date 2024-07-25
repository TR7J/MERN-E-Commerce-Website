import { Request, Response, NextFunction } from "express";

export const AdminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin Token" });
  }
};
