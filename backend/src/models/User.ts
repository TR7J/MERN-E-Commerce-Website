import mongoose, { Document, Model, Schema } from "mongoose";

interface IInteraction {
  productId: Schema.Types.ObjectId;
  type: string;
  timestamp: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  interactions: IInteraction[];
}

// Creating the interaction schema
const interactionSchema = new Schema<IInteraction>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    type: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Creating the user schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    interactions: {
      type: [interactionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Creating the User model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
