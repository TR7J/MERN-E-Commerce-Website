import request from "supertest";
import { app, server } from "../../src/index";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcryptjs";
import { generateToken } from "../../src/utils";
import User, { IUser } from "../../src/models/User";

// Define a type that only includes the necessary properties for token generation
interface ITokenPayload {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

let mongoServer: MongoMemoryServer | undefined;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {});
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
  if (server) {
    server.close(() => console.log("Server closed"));
  }
});

afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
  }
});

it("should get the current user information", async () => {
  const password = "password";
  const hashedPassword = bcrypt.hashSync(password, 8);

  const user = new User({
    name: "Test User",
    email: "test@example.com",
    password: hashedPassword,
  });

  await user.save();

  // Create the token with the user object
  const token = generateToken(user);
  console.log("Generated token:", token);

  const response = await request(app)
    .get("/api/users/profile")
    .set("Authorization", `Bearer ${token}`)
    .send();

  console.log("Response:", response.body);

  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("_id");
  expect(response.body).toHaveProperty("name", "Test User");
  expect(response.body).toHaveProperty("email", "test@example.com");
}, 10000);
