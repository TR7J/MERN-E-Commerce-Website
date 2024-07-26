import request from "supertest";
import { app } from "../../src/index";
import { Order } from "../../src/models/Order";
import User from "../../src/models/User";
import Product from "../../src/models/Product";
import mongoose from "mongoose";
import {
  createOrder,
  deleteOrder,
  deliverOrder,
  getOrderById,
  getOrders,
  getUserOrders,
  updateOrderToPaid,
} from "../../src/controllers/orderController";

jest.mock("../../src/models/Order");
jest.mock("../../src/models/User");
jest.mock("../../src/models/Product");

describe("Order Controller", () => {
  let req: any, res: any, next: any;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { _id: new mongoose.Types.ObjectId() },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe("getOrders", () => {
    it("should return all orders", async () => {
      const mockOrders = [
        { _id: new mongoose.Types.ObjectId(), user: { name: "John Doe" } },
      ];
      (Order.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOrders),
      });

      await getOrders(req, res);

      expect(res.send).toHaveBeenCalledWith(mockOrders);
    });

    it("should handle errors", async () => {
      const error = new Error("Error fetching orders");
      (Order.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockRejectedValue(error),
      });

      await getOrders(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Error fetching orders",
        error,
      });
    });
  });

  describe("getUserOrders", () => {
    it("should return orders of the authenticated user", async () => {
      const mockOrders = [{ _id: new mongoose.Types.ObjectId() }];
      (Order.find as jest.Mock).mockResolvedValue(mockOrders);

      await getUserOrders(req, res);

      expect(res.json).toHaveBeenCalledWith(mockOrders);
    });

    it("should handle errors", async () => {
      const error = new Error("Server error");
      (Order.find as jest.Mock).mockRejectedValue(error);

      await getUserOrders(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("getOrderById", () => {
    it("should return order by ID", async () => {
      const mockOrder = { _id: new mongoose.Types.ObjectId() };
      (Order.findById as jest.Mock).mockResolvedValue(mockOrder);

      await getOrderById(req, res);

      expect(res.json).toHaveBeenCalledWith(mockOrder);
    });

    it("should return 404 if order not found", async () => {
      (Order.findById as jest.Mock).mockResolvedValue(null);

      await getOrderById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Order Not Found" });
    });

    it("should handle errors", async () => {
      const error = new Error("Server error");
      (Order.findById as jest.Mock).mockRejectedValue(error);

      await getOrderById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("createOrder", () => {
    it("should create a new order", async () => {
      req.body.orderItems = [{ _id: new mongoose.Types.ObjectId() }];
      const mockOrder = { _id: new mongoose.Types.ObjectId() };
      (Order.create as jest.Mock).mockResolvedValue(mockOrder);

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Order Created",
        order: mockOrder,
      });
    });

    it("should return 400 if cart is empty", async () => {
      req.body.orderItems = [];

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Cart is empty" });
    });

    it("should handle errors", async () => {
      req.body.orderItems = [{ _id: new mongoose.Types.ObjectId() }];
      const error = new Error("Server error");
      (Order.create as jest.Mock).mockRejectedValue(error);

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("updateOrderToPaid", () => {
    it("should update order to paid", async () => {
      // Create a mock order with all expected properties
      const mockOrder = {
        _id: "66a301f9231a1269eb2cccb2",
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
          email_address: "test@example.com",
          paymentId: "paymentId123",
          status: "completed",
          update_time: new Date(),
        },
        save: jest.fn().mockResolvedValue({
          _id: "66a301f9231a1269eb2cccb2",
          isPaid: true,
          paidAt: new Date(),
          paymentResult: {
            email_address: "test@example.com",
            paymentId: "paymentId123",
            status: "completed",
            update_time: new Date(),
          },
        }),
      };

      (Order.findById as jest.Mock).mockResolvedValue(mockOrder);

      // Mock request body
      req.body = {
        id: "paymentId123",
        status: "completed",
        update_time: new Date(),
        email_address: "test@example.com",
      };

      await updateOrderToPaid(req, res);

      expect(res.json).toHaveBeenCalledWith({
        order: {
          _id: "66a301f9231a1269eb2cccb2",
          isPaid: true,
          paidAt: expect.any(Date),
          paymentResult: {
            email_address: "test@example.com",
            paymentId: "paymentId123",
            status: "completed",
            update_time: expect.any(Date),
          },
        },
        message: "Order Paid Successfully",
      });
    });

    it("should return 404 if order not found", async () => {
      (Order.findById as jest.Mock).mockResolvedValue(null);

      await updateOrderToPaid(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Order Not Found" });
    });

    it("should handle errors", async () => {
      const error = new Error("Server error");
      (Order.findById as jest.Mock).mockRejectedValue(error);

      await updateOrderToPaid(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("deleteOrder", () => {
    it("should delete an order", async () => {
      const mockOrder = { _id: new mongoose.Types.ObjectId() };
      (Order.findById as jest.Mock).mockResolvedValue(mockOrder);
      (Order.findByIdAndDelete as jest.Mock).mockResolvedValue(mockOrder);

      await deleteOrder(req, res);

      expect(res.send).toHaveBeenCalledWith({ message: "Order Deleted" });
    });

    it("should return 404 if order not found", async () => {
      (Order.findById as jest.Mock).mockResolvedValue(null);

      await deleteOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Order Not Found" });
    });

    it("should handle errors", async () => {
      const error = new Error("Error deleting order");
      (Order.findById as jest.Mock).mockRejectedValue(error);

      await deleteOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Error deleting order",
      });
    });
  });

  describe("deliverOrder", () => {
    it("should deliver an order", async () => {
      const mockOrder = { save: jest.fn(), _id: new mongoose.Types.ObjectId() };
      (Order.findById as jest.Mock).mockResolvedValue(mockOrder);

      await deliverOrder(req, res);

      expect(res.send).toHaveBeenCalledWith({ message: "Order Delivered" });
    });

    it("should return 404 if order not found", async () => {
      (Order.findById as jest.Mock).mockResolvedValue(null);

      await deliverOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Order Not Found" });
    });

    it("should handle errors", async () => {
      const error = new Error("Error delivering order");
      (Order.findById as jest.Mock).mockRejectedValue(error);

      await deliverOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "Error delivering order",
      });
    });
  });
});
