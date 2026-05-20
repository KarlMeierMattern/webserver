import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError, BadRequestError } from "./lib/error.js";
import { Request } from "express";
import { randomBytes } from "crypto";

export const hashPassword = (password: string): Promise<string> => {
  return argon2.hash(password);
};

export const checkPasswordHash = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return argon2.verify(hash, password);
};

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export const makeJWT = async (
  userID: string,
  expiresIn: number,
  secret: string
): Promise<string> => {
  const payload: Payload = {
    iss: "chirpy", // iss is the issuer of the token
    sub: userID, // sub is the subject of the token
    iat: Math.floor(Date.now() / 1000), // iat is the time the token was issued
    exp: Math.floor(Date.now() / 1000) + expiresIn, // exp is the time the token expires
  };

  const token = jwt.sign(payload, secret);

  return token;
};

export const validateJWT = async (
  tokenString: string,
  secret: string
): Promise<string> => {
  let decoded: Payload;

  try {
    decoded = jwt.verify(tokenString, secret) as Payload;
  } catch (e) {
    throw new UnauthorizedError("Invalid token");
  }

  if (decoded.iss !== "chirpy") {
    throw new UnauthorizedError("Invalid issuer");
  }

  if (!decoded.sub) {
    throw new UnauthorizedError("No user ID in token");
  }

  return decoded.sub;
};

export const getBearerToken = (req: Request) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw new BadRequestError("Malformed authorization header");
  }

  return extractBearerToken(authHeader);
};

export const extractBearerToken = (header: string) => {
  const splitAuth = header.split(" ");
  if (splitAuth.length < 2 || splitAuth[0] !== "Bearer") {
    throw new BadRequestError("Malformed authorization header");
  }
  return splitAuth[1];
};

export const makeRefreshToken = () => {
  return randomBytes(32).toString("hex");
};
