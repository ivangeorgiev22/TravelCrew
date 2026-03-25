import { vi, describe, test, expect, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import router from "../routes/authRoutes";

vi.mock("../controllers/authController", () => ({
  signUp: vi.fn((req, res) =>
    res.status(201).json({ name: mockUser.name, email: mockUser.email }),
  ),
  login: vi.fn((req, res) =>
    res.status(200).json({
      name: mockUser.name,
      token: "new.token.here",
    }),
  ),
}));

const app = express();
app.use(express.json());
app.use("/auth", router);

const mockUser = {
  name: "Jane Doe",
  email: "jane@example.com",
  hashedPassword: "secret",
};

describe("Auth Routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /signup", () => {
    test("should return a 201 status and user's name and email", async () => {
      const res = await request(app).post("/auth/signup").send({
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.hashedPassword,
      });
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ name: mockUser.name, email: mockUser.email });
    });
  });

  describe("POST /login", () => {
    test("should return a 200 status and user's name and session token", async () => {
      const res = await request(app).post("/auth/login").send({
        email: mockUser.email,
        password: mockUser.hashedPassword,
      });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        name: mockUser.name,
        token: "new.token.here",
      });
    });
  });
});
