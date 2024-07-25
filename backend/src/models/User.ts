import mongoose, { Document, Model, Schema } from "mongoose";

// Define an interface for the User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

// Create the user schema
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
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create the User model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
