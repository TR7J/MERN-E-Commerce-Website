export type ProductType = {
  _id?: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  category: string;
  brand: string /* ** */;
  description: string;
  rating: number;
  numberOfReviews: number;
  countInStock: number;
};
