import { describe, it, expect, beforeAll } from "vitest";
import {
  hashPassword,
  checkPasswordHash,
  makeJWT,
  validateJWT,
  extractBearerToken,
} from "./auth.js";
import { BadRequestError } from "./lib/error.js";

describe("Password hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  // This hashes the passwords once when the test file starts, then all your tests use those pre-hashed values
  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password2, hash2);
    expect(result).toBe(true);
  });
});

describe("JWT creation and validation", () => {
  const userId = "12345";
  const secret = "supersecretkey";
  let token: string;

  beforeAll(async () => {
    token = await makeJWT(userId, 3600, secret);
  });

  it("should return the user ID for a valid token", async () => {
    const result = await validateJWT(token, secret);
    expect(result).toBe(userId);
  });
});

describe("extract bearer token", () => {
  it("should extract the token from the header", () => {
    const token = "mySecretToken";
    const header = `Bearer ${token}`;
    expect(extractBearerToken(header)).toBe(token);
  });

  it("should extract the token from the header", () => {
    const token = "mySecretToken";
    const header = `Bearer ${token} extra stuff`;
    expect(extractBearerToken(header)).toBe(token);
  });

  it("should extract the token from the header", () => {
    const header = `Bearer`;
    expect(() => extractBearerToken(header)).toThrow(BadRequestError);
  });

  it("should extract the token from the header", () => {
    const header = `Other stuff`;
    expect(() => extractBearerToken(header)).toThrow(BadRequestError);
  });

  it("should extract the token from the header", () => {
    const header = "";
    expect(() => extractBearerToken(header)).toThrow(BadRequestError);
  });
});
