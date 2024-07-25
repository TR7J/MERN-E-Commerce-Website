import { Request, Response } from "express";

export const uploadFileController = async (req: Request, res: Response) => {
  try {
    const image = req.file
      ? /* req.file.path   */ `/uploads/${req.file.filename}`
      : "";

    res.status(200).json({ message: "Image added successfully", image });
  } catch (error) {
    console.error("Error adding image:", error);
    res.status(500).json({ message: "Error adding image", error });
  }
};
