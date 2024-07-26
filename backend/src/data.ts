import bcrypt from "bcryptjs";
import { ProductType } from "./types/ProductType";
import { User } from "./types/User";

export const sampleProducts: ProductType[] = [
  {
    name: "Nike Slim shirt",
    slug: "nike-slim-shirt",
    category: "Shirts",
    image: "../images/car-engine-cylinder-gasket.jpg",
    price: 120,
    countInStock: 10,
    brand: "Nike",
    rating: 4.5,
    numberOfReviews: 10,
    description: "high quality shirt",
  },
  {
    name: "Adidas Fit Shirt",
    slug: "adidas-fit-shirt",
    category: "Shirts",
    image: "../images/car-radiators.jpeg",
    price: 100,
    countInStock: 20,
    brand: "Adidas",
    rating: 4.0,
    numberOfReviews: 10,
    description: "high quality product",
  },
  {
    name: "Lacoste Free Pants",
    slug: "lacoste-free-pants",
    category: "Pants",
    image: "../images/clutch_kit.jpg",
    price: 220,
    countInStock: 0,
    brand: "Lacoste",
    rating: 4.8,
    numberOfReviews: 17,
    description: "high quality product",
  },
  {
    name: "Nike Slim Pant",
    slug: "nike-slim-pant",
    category: "Pants",
    image: "../images/spark-plugs.jpg",
    price: 78,
    countInStock: 15,
    brand: "Nike",
    rating: 4.5,
    numberOfReviews: 14,
    description: "high quality product",
  },
];

export const sampleUsers: User[] = [
  {
    name: "Joe",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456"),
    isAdmin: true,
  },
  {
    name: "John",
    email: "user@example.com",
    password: bcrypt.hashSync("123456"),
    isAdmin: false,
  },
];
