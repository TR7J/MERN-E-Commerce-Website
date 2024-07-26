import { Request, Response } from "express";
import { Order } from "../models/Order";
import { ProductType } from "../types/ProductType";
import User from "../models/User";
import Product from "../models/Product";

// admin to get orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate("user", "name");
    res.send(orders);
  } catch (error) {
    res.status(500).send({ message: "Error fetching orders", error });
  }
};

// Get orders of the authenticated user
export const getUserOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get order by ID
export const getOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new order
export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.body.orderItems.length === 0) {
      res.status(400).json({ message: "Cart is empty" });
      return;
    }

    const createdOrder = await Order.create({
      orderItems: req.body.orderItems.map((x: ProductType) => ({
        ...x,
        product: x._id,
      })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    res.status(201).json({ message: "Order Created", order: createdOrder });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update order to paid
export const updateOrderToPaid = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date(Date.now());
      order.paymentResult = {
        paymentId: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();

      res.json({ order: updatedOrder, message: "Order Paid Successfully" });
    } else {
      res.status(404).json({ message: "Order Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await Order.findByIdAndDelete(req.params.id);
      res.send({ message: "Order Deleted" });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error deleting order" });
  }
};

export const deliverOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      await order.save();
      res.send({ message: "Order Delivered" });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error delivering order" });
  }
};
