import User, { IUser } from "../models/User";
import { Types } from "mongoose";

export const recordInteraction = async (
  userId: string,
  productId: string,
  type: string
) => {
  const interaction = {
    productId: new Types.ObjectId(productId),
    type,
    timestamp: new Date(),
  };

  await User.updateOne(
    { _id: new Types.ObjectId(userId) },
    { $push: { interactions: interaction } }
  );
};
