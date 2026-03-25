import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { login, register, logout } from './auth';
import type { UserData } from '../types/userData';


vi.mock('axios');

const mockedAxios = axios as unknown as {
  post: ReturnType<typeof vi.fn>;
};

const store: Record<string, string> = {};

vi.stubGlobal("localStorage", {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => {
    store[key] = value;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    Object.keys(store).forEach((key) => delete store[key]);
  },
});

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

console.log(localStorage)

const API = 'http://127.0.0.1:3000/auth' 

describe("Login", () => {

  it("Calls API and stores token + username", async () => {
    const mockResponse = {
      data: {
        token: "abc1234",
        name: "John"
      },
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    const result = await login({
      email: "test@test.com",
      password: "123456"
    } as UserData);

    expect(mockedAxios.post).toHaveBeenCalledWith(`${API}/login`, {email: "test@test.com", password: "123456"});
    expect(localStorage.getItem("token")).toBe("abc1234");
    expect(localStorage.getItem("userName")).toBe("John");
    expect(result).toEqual(mockResponse.data);
  });

  it("Does not store token if none returned", async () => {
    mockedAxios.post.mockResolvedValue({ data: {} });

    await login({ email: "test", password: "123" } as UserData);

    expect(localStorage.getItem("token")).toBe(null);
    expect(localStorage.getItem("userName")).toBe(null);
  });
})

describe("Register", () => {

  it("Calls API and registers user", async () => {
    mockedAxios.post.mockResolvedValue({});

    await register({
      name: "John",
      email: "test@test.com",
      password: "123456"
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(`${API}/signup`, {name: "John", email: "test@test.com", password: "123456"});
  });
});

describe("Logout", () => {

  it("Removes token and username from localStorage", () => {
    localStorage.setItem("token", "abc123");
    localStorage.setItem("userName", "John");

    logout();

    expect(localStorage.getItem("token")).toBe(null);
    expect(localStorage.getItem("userName")).toBe(null);
  });
});