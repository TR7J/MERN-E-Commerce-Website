import { Request, Response } from "express";
import Product from "../models/Product";
import { Order } from "../models/Order";

export const getRecommendations = async (req: Request, res: Response) => {
  try {
    // Fetch the user's cart items
    const order = await Order.findOne({
      user: req.params.userId,
      isPaid: false,
    }).populate("orderItems.product");

    if (!order) {
      return res.status(404).json({ message: "No active cart found for user" });
    }

    const cartItems = order.orderItems;

    // Extract categories from cart items
    const categories = cartItems.map((item) => item.product?.category);

    // Get products from similar categories
    const recommendedProducts = await Product.find({
      category: { $in: categories },
      _id: { $nin: cartItems.map((item) => item.product?._id) }, // Exclude items already in cart
    }).limit(10); // Limit the number of recommendations

    res.json(recommendedProducts);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
