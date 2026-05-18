import { Request, Response } from "express";
import { checkPasswordHash } from "../auth.js";
import { BadRequestError, UnauthorizedError } from "../lib/error.js";
import { getUserByEmail } from "../db/queries/users.js";

type params = {
  password: string;
  email: string;
};

export const handlerLogin = async (req: Request, res: Response) => {
  const { email, password }: params = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const user = await getUserByEmail(email);

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const hashedPasswordFromDB = user?.hashedPassword;

  if (!hashedPasswordFromDB) {
    throw new BadRequestError("Invalid email or password");
  }

  const matching = await checkPasswordHash(password, hashedPasswordFromDB);

  if (!matching) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const userResponse = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
  };

  return res.status(200).json(userResponse);
};
