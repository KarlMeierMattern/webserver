import { Request, Response } from "express";
import { BadRequestError } from "../lib/error.js";
import { createUser } from "../db/queries/users.js";
import { hashPassword } from "../auth.js";
import { NewUser } from "../db/schema.js";

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
  };

  return res.status(201).json(userResponse);
};
