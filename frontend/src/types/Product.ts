/* export type Product = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  category: string;
  brand: string;
  description: string;
  rating: number;
  numberOfReviews: number;
  countInStock: number;
};
 */
export type Review = {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string; // ISO date string
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  category: string;
  brand: string;
  description: string;
  rating: number;
  numberOfReviews: number;
  countInStock: number;
  reviews: Review[];
};
