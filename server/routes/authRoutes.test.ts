import { vi, describe, test, expect, Mock, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { User } from "../models";
import router from "../routes/authRoutes";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

vi.mock("../models", () => {
  return {
    User: {
      findOne: vi.fn(),
      create: vi.fn(),
    },
  };
});
vi.mock("jsonwebtoken");
vi.mock("bcrypt");

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
      vi.mocked(User.findOne as Mock).mockResolvedValue(null);
      vi.mocked(User.create).mockResolvedValue(mockUser);
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
      vi.mocked(User.findOne as Mock).mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare as Mock).mockResolvedValue(true);
      vi.mocked(jwt.sign as Mock).mockReturnValue("new.token.here");

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
