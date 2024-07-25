import express from "express";
import {
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrderToPaid,
  getOrders,
  deleteOrder,
  deliverOrder,
} from "../controllers/orderController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { AdminMiddleware } from "../middleware/AdminMiddleware";
import { getOrderSummary } from "../controllers/orderController";

const orderRouter = express.Router();

orderRouter.get("/mine", AuthMiddleware, getUserOrders);
orderRouter.get("/:id", AuthMiddleware, getOrderById);
orderRouter.get("/", AuthMiddleware, AdminMiddleware, getOrders);
orderRouter.post("/", AuthMiddleware, createOrder);
orderRouter.put("/:id/pay", AuthMiddleware, updateOrderToPaid);
orderRouter.put("/:id/deliver", AuthMiddleware, AdminMiddleware, deliverOrder);
orderRouter.delete("/:id", AuthMiddleware, AdminMiddleware, deleteOrder);
orderRouter.get("/summary", AuthMiddleware, AdminMiddleware, getOrderSummary);

export { orderRouter };
