import express from "express";
import {
  getProducts,
  getCategories,
  getProductBySlug,
  searchProducts,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  addReviewController,
} from "../controllers/productController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { AdminMiddleware } from "../middleware/AdminMiddleware";
import { validateInput } from "../middleware/ValidatorsMiddleware";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/productValidator";

export const productRouter = express.Router();

// /api/products
productRouter.get("/", getProducts);

// /api/products/categories
productRouter.get("/categories", getCategories);

// /api/products/slug/:slug
productRouter.get("/slug/:slug", getProductBySlug);

// search products route
productRouter.get("/search", searchProducts);

// add a review
productRouter.post("/:id/reviews", AuthMiddleware, addReviewController);

// get products route
productRouter.get("/admin", AuthMiddleware, AdminMiddleware, getAdminProducts);

productRouter.get("/:id", getProductById);

// Post product route
productRouter.post(
  "/",
  AuthMiddleware,
  AdminMiddleware,
  validateInput(createProductSchema),
  createProduct
);

// Update product route
productRouter.put(
  "/:id",
  AuthMiddleware,
  AdminMiddleware,
  validateInput(updateProductSchema),
  updateProduct
);

// Delete product route
productRouter.delete("/:id", AuthMiddleware, AdminMiddleware, deleteProduct);

export default productRouter;
