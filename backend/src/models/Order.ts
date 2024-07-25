import mongoose, { Schema, model } from "mongoose";

// Define ShippingAddress schema
const ShippingAddressSchema = new Schema({
  fullName: { type: String },
  address: { type: String },
  city: { type: String },
  postalCode: { type: String },
  country: { type: String },
  lat: { type: Number },
  lng: { type: Number },
});

// Define Item schema
const ItemSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
});

// Define PaymentResult schema
const PaymentResultSchema = new Schema({
  paymentId: { type: String },
  status: { type: String },
  update_time: { type: String },
  email_address: { type: String },
});

// Define Order schema
const OrderSchema = new Schema(
  {
    orderItems: [ItemSchema],
    shippingAddress: ShippingAddressSchema,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentMethod: { type: String, required: true },
    paymentResult: PaymentResultSchema,
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

export const Order = model("Order", OrderSchema);
