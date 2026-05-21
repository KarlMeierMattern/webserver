import { Request, Response } from "express";
import { BadRequestError } from "../lib/error.js";
import { createUser, updateUser } from "../db/queries/users.js";
import { hashPassword } from "../auth.js";
import { NewUser } from "../db/schema.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

type params = {
  email: string;
  password: string;
};

type UserResponse = Omit<NewUser, "password">;

export const handlerCreateUser = async (req: Request, res: Response) => {
  const { email, password }: params = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const hashedPassword = await hashPassword(password);

  if (!hashedPassword) {
    throw new BadRequestError("Failed to hash password");
  }

  const newUser = await createUser({ email, hashedPassword: hashedPassword });

  if (!newUser) {
    throw new Error("Failed to create user");
  }
  const userResponse: UserResponse = {
    id: newUser.id,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
    email: newUser.email,
    isChirpyRed: newUser.isChirpyRed,
  };

  return res.status(201).json(userResponse);
};

export const handlerUpdateUser = async (req: Request, res: Response) => {
  const token = getBearerToken(req);
  const userId = await validateJWT(token, config.jwt.secret);

  const { password, email } = req.body;

  if (!password || !email) {
    throw new BadRequestError("Email and password are required");
  }

  const newHashedPassword = await hashPassword(password);

  if (!newHashedPassword) {
    throw new BadRequestError("Failed to hash password");
  }

  const newUser = await updateUser({
    id: userId,
    email,
    hashedPassword: newHashedPassword,
  });

  if (!newUser) {
    throw new Error("Failed to update user");
  }

  const userResponse: UserResponse = {
    id: newUser.id,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
    email: newUser.email,
  };

  return res.status(200).json(userResponse);
};
