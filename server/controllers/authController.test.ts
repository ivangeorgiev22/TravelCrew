import { describe, vi, test, expect, beforeEach, Mock } from "vitest";
import { signUp, login } from "./authController";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models";

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

const mockUser = {
  name: "Jane Doe",
  email: "jane@example.com",
  hashedPassword: "secret",
};

const mockRes = () =>
  ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  }) as unknown as Response;

describe("Auth Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Register new user", () => {
    const req = {
      body: {
        name: mockUser.name,
        email: mockUser.email,
        password: mockUser.hashedPassword,
      },
    } as Request;

    test("should return 201 on user creation", async () => {
      vi.mocked(bcrypt.hash as Mock).mockResolvedValue(mockUser.hashedPassword);
      vi.mocked(User.create).mockResolvedValue(mockUser);
      const res = mockRes();
      await signUp(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        name: mockUser.name,
        email: mockUser.email,
      });
    });

    test("should return 409 if user already exists", async () => {
      vi.mocked(User.findOne as Mock).mockResolvedValue(mockUser);
      const res = mockRes();
      await signUp(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        msg: "There's already an account with this email",
      });
    });

    test("should return 400 if missing credentials", async () => {
      const req = { body: { email: mockUser.email } } as Request; //just email, missing other fields
      const res = mockRes();
      await signUp(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Missing credentials",
      });
    });
  });

  describe("Login user", () => {
    const req = {
      body: {
        email: mockUser.email,
        password: mockUser.hashedPassword,
      },
    } as Request;

    beforeEach(() => {
      process.env.JWT_SECRET = "secretkey";
    });

    test("should return 200 on successful login", async () => {
      vi.mocked(User.findOne as Mock).mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare as Mock).mockResolvedValue(true);
      vi.mocked(jwt.sign as Mock).mockReturnValue("new.token.here");

      const res = mockRes();
      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        name: mockUser.name,
        token: "new.token.here",
      });
    });

    test("should return 401 if user not found", async () => {
      vi.mocked(User.findOne as Mock).mockResolvedValue(null);
      const res = mockRes();
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ msg: "Invalid credentials" });
    });

    test("should return 401 if incorrect password", async () => {
      vi.mocked(User.findOne as Mock).mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare as Mock).mockResolvedValue(false);
      const res = mockRes();
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ msg: "Invalid credentials" });
    });

    test("should return 400 if missing credentials", async () => {
      const req = { body: { email: mockUser.email } } as Request; //just email, missing password
      const res = mockRes();
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Email and password required",
      });
    });
  });
});
