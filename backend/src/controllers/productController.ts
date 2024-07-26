import { Request, Response, NextFunction } from "express";
import Product, { IProduct } from "../models/Product";
import { recordInteraction } from "./recordUserActivity";

// admin abilities
export const getAdminProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
    });
  } catch (error) {
    res.status(500).send({ message: "Error fetching products", error });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error: (error as Error).message,
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = new Product({
      name: "sample name " + Date.now(),
      slug: "sample-name-" + Date.now(),
      image: "/images/p1.jpg",
      price: 2000,
      category: "sample category",
      brand: "sample brand",
      countInStock: 0,
      rating: 0,
      numberOfReviews: 0,
      description: "sample description",
    });
    const product = await newProduct.save();
    res.status(201).send({ message: "Product Created", product });
  } catch (error) {
    res.status(500).send({ message: "Error creating product", error });
  }
};

// Update Product Controller
export const updateProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.slug = req.body.slug;
      product.price = req.body.price;
      product.image = req.body.image;
      product.category = req.body.category;
      product.brand = req.body.brand;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      await product.save();
      res.send({ message: "Product Updated" });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error updating product", error: error });
  }
};

// Delete Product Controller
export const deleteProduct = async (req: Request, res: Response) => {
  const productId = req.params.id;
  try {
    const result = await Product.findByIdAndDelete(productId);
    if (result) {
      res.send({ message: "Product Deleted" });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error deleting product", error: error });
  }
};

// user abilities/ also admin
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Product.find().distinct("category");
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

export const getProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      // Record the view interaction
      await recordInteraction(
        userId,
        product?._id.toString() as string,
        "view"
      );
      res.json(product);
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {
    next(error);
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  const query = req.query.query || "";
  const category = req.query.category || "";
  //
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  //
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

  const queryFilter = query ? { name: { $regex: query, $options: "i" } } : {};
  const categoryFilter = category ? { category } : {};
  //
  const priceFilter: any = {};

  // Add price filter if minPrice or maxPrice is provided
  if (minPrice !== undefined || maxPrice !== undefined) {
    if (minPrice !== undefined) {
      priceFilter.$gte = minPrice; // Greater than or equal to minPrice
    }
    if (maxPrice !== undefined) {
      priceFilter.$lte = maxPrice; // Less than or equal to maxPrice
    }
  }
  // Combine filters
  const filters = {
    ...queryFilter,
    ...categoryFilter,
    ...(Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {}),
  };
  try {
    const products = await Product.find(filters);
    res.send(products);
  } catch (error) {
    res.status(500).send({ message: "Error in fetching products" });
  }
};

//  Add a review to a product
export const addReviewController = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;
    // Record the rating interaction
    await recordInteraction(userId, productId, "rating");

    // Record the review interaction
    await recordInteraction(userId, productId, "review");

    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: "You already submitted a review" });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };

      product.reviews.push(review);
      product.numberOfReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;

      const updatedProduct = await product.save();

      res.status(201).send({
        message: "Review Created",
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numberOfReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error adding review", error });
  }
};
