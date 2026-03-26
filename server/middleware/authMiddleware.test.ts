import { describe, expect, it, vi, beforeEach } from 'vitest';
import { authMiddleware } from './authMiddleware';
import jwt from 'jsonwebtoken';

// Mock JWT
vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}));

// Mock req,res,next

const mockReq = (headers = {}) => ({
  headers,
}) as any;

const mockRes = () => {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const mockNext = vi.fn();

beforeEach(() => {
  process.env.JWT_SECRET = "test-secret"
  vi.clearAllMocks();
});

describe("authMiddleware", () => {

  it("Returns 401 if no token provided", () => {
    const req = mockReq();
    const res = mockRes();

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({error: "Access denied, no token provided"});
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("Returns 401 if token is invalid", () => {
    const req = mockReq({authorization: "Bearer invalidToken"});
    const res = mockRes();

    (jwt.verify as any).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({error: "Invalid token"});
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("Calls next and sets req.user if token is valid", () => {
    const req = mockReq({authorization: "Bearer validToken"});
    const res = mockRes();

    const decoded = {id: "1"};
    (jwt.verify as any).mockReturnValue(decoded);

    authMiddleware(req, res, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith("validToken", expect.any(String));
    expect(req.user).toEqual(decoded);
    expect(mockNext).toHaveBeenCalled();
  });
})