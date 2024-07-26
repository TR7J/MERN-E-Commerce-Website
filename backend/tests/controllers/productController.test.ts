import { Request, Response } from "express";
import Product from "../../src/models/Product";
import * as productController from "../../src/controllers/productController";
import { recordInteraction } from "../../src/controllers/recordUserActivity";

jest.mock("../../src/models/Product");
jest.mock("../../src/controllers/recordUserActivity");

describe("Product Controller Unit Tests", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("getAdminProducts should return all products and count", async () => {
    const req = {} as Request;
    const res = {
      send: jest.fn(),
    } as unknown as Response;

    (Product.find as jest.Mock).mockResolvedValue([{ name: "Product1" }]);
    (Product.countDocuments as jest.Mock).mockResolvedValue(1);

    await productController.getAdminProducts(req, res);

    expect(res.send).toHaveBeenCalledWith({
      products: [{ name: "Product1" }],
      countProducts: 1,
    });
  });

  test("getProductById should return product by ID", async () => {
    const req = { params: { id: "1" } } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    (Product.findById as jest.Mock).mockResolvedValue({ name: "Product1" });

    await productController.getProductById(req, res);

    expect(res.json).toHaveBeenCalledWith({ name: "Product1" });
  });

  test("createProduct should create a new product", async () => {
    const req = { body: {} } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    const newProduct = new Product({
      name: "sample name",
      slug: "sample-name",
      image: "/images/p1.jpg",
      price: 2000,
      category: "sample category",
      brand: "sample brand",
      countInStock: 0,
      rating: 0,
      numberOfReviews: 0,
      description: "sample description",
    });

    (Product.prototype.save as jest.Mock).mockResolvedValue(newProduct);

    await productController.createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      message: "Product Created",
      product: newProduct,
    });
  });

  test("updateProduct should update an existing product", async () => {
    const req = {
      params: { id: "1" },
      body: { name: "Updated Product" },
    } as unknown as Request;
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    (Product.findById as jest.Mock).mockResolvedValue({
      name: "Old Product",
      save: jest.fn().mockResolvedValue({ name: "Updated Product" }),
    });

    await productController.updateProduct(req, res);

    expect(res.send).toHaveBeenCalledWith({ message: "Product Updated" });
  });

  test("deleteProduct should delete an existing product", async () => {
    const req = { params: { id: "1" } } as unknown as Request;
    const res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    (Product.findByIdAndDelete as jest.Mock).mockResolvedValue({
      name: "Product to delete",
    });

    await productController.deleteProduct(req, res);

    expect(res.send).toHaveBeenCalledWith({ message: "Product Deleted" });
  });

  test("searchProducts should return filtered products", async () => {
    const req = {
      query: { query: "Product", minPrice: "10", maxPrice: "100" },
    } as unknown as Request;
    const res = {
      send: jest.fn(),
    } as unknown as Response;

    (Product.find as jest.Mock).mockResolvedValue([
      { name: "Filtered Product" },
    ]);

    await productController.searchProducts(req, res);

    expect(res.send).toHaveBeenCalledWith([{ name: "Filtered Product" }]);
  });

  test("addReviewController should add a review to a product", async () => {
    const req = {
      params: { id: "1" },
      user: { _id: "user1", name: "User1" },
      body: { rating: 5, comment: "Great product!" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    (recordInteraction as jest.Mock).mockResolvedValue(null);

    (Product.findById as jest.Mock).mockResolvedValue({
      reviews: [],
      numberOfReviews: 0,
      rating: 0,
      save: jest.fn().mockResolvedValue({
        reviews: [
          {
            name: "User1",
            rating: 5,
            comment: "Great product!",
          },
        ],
        numberOfReviews: 1,
        rating: 5,
      }),
    });

    await productController.addReviewController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      message: "Review Created",
      review: {
        name: "User1",
        rating: 5,
        comment: "Great product!",
      },
      numReviews: 1,
      rating: 5,
    });
  });
});
