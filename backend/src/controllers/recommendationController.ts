import Product from "../models/Product";
import User, { IUser } from "../models/User";
import { Types } from "mongoose";

const isValidObjectId = (id: string) => {
  return Types.ObjectId.isValid(id) && new Types.ObjectId(id).toString() === id;
};

const getRecommendations = async (userId: string) => {
  const user = await User.findById(userId).populate("interactions.productId");

  if (!user) {
    throw new Error("User not found");
  }

  // Collect products interacted by the user
  const interactedProducts = user.interactions
    .map((interaction) => interaction.productId.toString())
    .filter(isValidObjectId); // Ensure only valid ObjectId strings

  // Find other users with similar interactions
  const similarUsers = await User.find({
    "interactions.productId": {
      $in: interactedProducts.map((id) => new Types.ObjectId(id)),
    },
    _id: { $ne: userId },
  }).populate("interactions.productId");

  // Aggregate recommended products from similar users
  const recommendedProducts: Record<string, number> = {};
  similarUsers.forEach((similarUser: IUser) => {
    similarUser.interactions.forEach((interaction) => {
      const productIdStr = interaction.productId.toString();
      if (
        isValidObjectId(productIdStr) &&
        !interactedProducts.includes(productIdStr)
      ) {
        recommendedProducts[productIdStr] =
          (recommendedProducts[productIdStr] || 0) + 1;
      }
    });
  });

  // Sort recommended products by frequency
  const sortedRecommendations = Object.keys(recommendedProducts).sort(
    (a, b) => recommendedProducts[b] - recommendedProducts[a]
  );

  // Fetch product details
  const products = await Product.find({
    _id: {
      $in: sortedRecommendations
        .filter(isValidObjectId)
        .map((id) => new Types.ObjectId(id)),
    },
  });

  return products;
};

export { getRecommendations };
