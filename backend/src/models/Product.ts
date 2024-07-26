import mongoose, { Document, Schema } from "mongoose";

// Define the interface for Review
interface IReview {
  name: string;
  comment: string;
  rating: number;
}

// Define the interface for Product
export interface IProduct extends Document {
  _id: string;
  name: string;
  slug: string;
  image: string;
  images: string[];
  brand: string;
  category: string;
  description: string;
  price: number;
  countInStock: number;
  rating: number;
  numberOfReviews: number;
  reviews: IReview[];
}

// Define the review schema
const reviewSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// Define the product schema
const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    images: { type: [String], default: [] },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    numberOfReviews: { type: Number, required: true, default: 0 },
    reviews: { type: [reviewSchema], default: [] },
  },
  { timestamps: true }
);

// Add indexes for better query performance
// Index for category field
productSchema.index({ category: 1 });

// Index for price field
productSchema.index({ price: 1 });

// Create the Product model
const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
