import { Request, Response } from "express";
import { BadRequestError } from "../lib/error.js";
import { createUser } from "../db/queries/users.js";

export const handlerCreateUser = async (req: Request, res: Response) => {
  type params = {
    email: string;
  };

  const { email }: params = req.body;

  if (!email) {
    throw new BadRequestError("Email is required");
  }

  const newUser = await createUser({ email });

  if (!newUser) {
    throw new Error("Failed to create user");
  }

  return res.status(201).json(newUser);
};
