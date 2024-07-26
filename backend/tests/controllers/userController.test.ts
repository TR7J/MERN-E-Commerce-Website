import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../src/models/User";
import {
  signinUser,
  signupUser,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
} from "../../src/controllers/userController";
import { generateToken } from "../../src/utils";

jest.mock("../../src/models/User");
jest.mock("../../src/utils");

describe("User Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  describe("signinUser", () => {
    it("should sign in user with valid credentials", async () => {
      req.body = { email: "test@example.com", password: "password" };

      const user = {
        _id: "1",
        name: "Test User",
        email: "test@example.com",
        password: bcrypt.hashSync("password", 8),
        isAdmin: false,
      };

      (User.findOne as jest.Mock).mockResolvedValue(user);
      (generateToken as jest.Mock).mockReturnValue("token");

      await signinUser(req as Request, res as Response);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(res.json).toHaveBeenCalledWith({
        _id: "1",
        name: "Test User",
        email: "test@example.com",
        isAdmin: false,
        token: "token",
      });
    });

    it("should return 401 for invalid credentials", async () => {
      req.body = { email: "test@example.com", password: "wrongpassword" };

      const user = {
        _id: "1",
        name: "Test User",
        email: "test@example.com",
        password: bcrypt.hashSync("password", 8),
        isAdmin: false,
      };

      (User.findOne as jest.Mock).mockResolvedValue(user);

      await signinUser(req as Request, res as Response);

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid email or password",
      });
    });
  });

  describe("signupUser", () => {
    it("should sign up a new user", async () => {
      req.body = {
        name: "Test User",
        email: "test@example.com",
        password: "password",
      };

      const user = {
        _id: "1",
        name: "Test User",
        email: "test@example.com",
        password: bcrypt.hashSync("password", 8),
        isAdmin: false,
      };

      (User.create as jest.Mock).mockResolvedValue(user);
      (generateToken as jest.Mock).mockReturnValue("token");

      await signupUser(req as Request, res as Response);

      expect(User.create).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        password: expect.any(String),
      });
      expect(res.json).toHaveBeenCalledWith({
        _id: "1",
        name: "Test User",
        email: "test@example.com",
        isAdmin: false,
        token: "token",
      });
    });
  });

  describe("updateUserProfile", () => {
    it("should update user profile", async () => {
      // Ensure req.user has all required properties
      req.user = {
        _id: "1",
        name: "Test User",
        email: "test@example.com",
        isAdmin: false,
        token: "some-token",
      };
      req.body = {
        name: "Updated User",
        email: "updated@example.com",
        password: "newpassword",
      };

      // Create a mock user object
      const user = {
        _id: "1",
        name: "Test User",
        email: "test@example.com",
        password: bcrypt.hashSync("password", 8),
        isAdmin: false,
        save: jest.fn().mockResolvedValue({
          _id: "1",
          name: "Updated User",
          email: "updated@example.com",
          isAdmin: false,
        }),
      };

      // Mock User.findById and generateToken
      (User.findById as jest.Mock).mockResolvedValue(user);
      (generateToken as jest.Mock).mockReturnValue("token");

      await updateUserProfile(req as Request, res as Response);

      // Ensure User.findById is called with req.user._id
      expect(User.findById).toHaveBeenCalledWith("1");
      // Ensure user.save is called
      expect(user.save).toHaveBeenCalled();
      // Ensure the response contains the updated user profile
      expect(res.json).toHaveBeenCalledWith({
        _id: "1",
        name: "Updated User",
        email: "updated@example.com",
        isAdmin: false,
        token: "token",
      });
    });

    it("should return 404 if user not found", async () => {
      req.user = {
        _id: "1",
        name: "Test User",
        email: "test@example.com",
        isAdmin: false,
        token: "some-token",
      };

      // Return null from User.findById
      (User.findById as jest.Mock).mockResolvedValue(null);

      await updateUserProfile(req as Request, res as Response);

      expect(User.findById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should handle errors", async () => {
      req.user = {
        _id: "1",
        name: "Test User",
        email: "test@example.com",
        isAdmin: false,
        token: "some-token",
      };
      const error = new Error("Server error");

      // Simulate error from User.findById
      (User.findById as jest.Mock).mockRejectedValue(error);

      await updateUserProfile(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("getUsers", () => {
    it("should get all users", async () => {
      const users = [
        {
          _id: "1",
          name: "Test User",
          email: "test@example.com",
          isAdmin: false,
        },
      ];

      (User.find as jest.Mock).mockResolvedValue(users);

      await getUsers(req as Request, res as Response);

      expect(User.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith(users);
    });
  });

  describe("getUserById", () => {
    it("should get user by ID", async () => {
      req.params = { id: "1" };

      const user = {
        _id: "1",
        name: "Test User",
        email: "test@example.com",
        isAdmin: false,
      };

      (User.findById as jest.Mock).mockResolvedValue(user);

      await getUserById(req as Request, res as Response);

      expect(User.findById).toHaveBeenCalledWith("1");
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it("should return 404 if user not found", async () => {
      req.params = { id: "1" };

      (User.findById as jest.Mock).mockResolvedValue(null);

      await getUserById(req as Request, res as Response);

      expect(User.findById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User Not Found" });
    });
  });

  describe("updateUser", () => {
    it("should update a user", async () => {
      req.params = { id: "1" };
      req.body = {
        name: "Updated User",
        email: "updated@example.com",
        isAdmin: true,
      };

      const user = {
        _id: "1",
        name: "Test User",
        email: "test@example.com",
        isAdmin: false,
        save: jest.fn().mockResolvedValue({
          _id: "1",
          name: "Updated User",
          email: "updated@example.com",
          isAdmin: true,
        }),
      };

      (User.findById as jest.Mock).mockResolvedValue(user);

      await updateUser(req as Request, res as Response);

      expect(User.findById).toHaveBeenCalledWith("1");
      expect(user.save).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        message: "User Updated",
        user: {
          _id: "1",
          name: "Updated User",
          email: "updated@example.com",
          isAdmin: true,
        },
      });
    });

    it("should return 404 if user not found", async () => {
      req.params = { id: "1" };

      (User.findById as jest.Mock).mockResolvedValue(null);

      await updateUser(req as Request, res as Response);

      expect(User.findById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User Not Found" });
    });
  });

  describe("deleteUser", () => {
    it("should delete a user and return success message", async () => {
      req.params = { id: "1" };

      const user = {
        _id: "1",
        name: "Test User",
        email: "test@example.com",
        isAdmin: false,
      };

      (User.findById as jest.Mock).mockResolvedValue(user);
      (User.deleteOne as jest.Mock).mockResolvedValue({});

      await deleteUser(req as Request, res as Response);

      expect(User.findById).toHaveBeenCalledWith("1");
      expect(User.deleteOne).toHaveBeenCalledWith({ _id: "1" });
      expect(res.send).toHaveBeenCalledWith({ message: "User Deleted" });
    });

    it("should return 404 if user not found", async () => {
      req.params = { id: "1" };

      (User.findById as jest.Mock).mockResolvedValue(null);

      await deleteUser(req as Request, res as Response);

      expect(User.findById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User Not Found" });
    });

    it("should return 400 if trying to delete an admin user", async () => {
      req.params = { id: "1" };

      const user = {
        _id: "1",
        name: "Admin User",
        email: "admin@example.com",
        isAdmin: true,
      };

      (User.findById as jest.Mock).mockResolvedValue(user);

      await deleteUser(req as Request, res as Response);

      expect(User.findById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Cannot Delete Admin User",
      });
    });
  });
});
