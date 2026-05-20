import { Request, Response } from "express";
import { config } from "../config.js";
import { BadRequestError, UnauthorizedError } from "../lib/error.js";
import {
  checkPasswordHash,
  makeJWT,
  makeRefreshToken,
  getBearerToken,
} from "../auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import {
  createRefreshToken,
  getValidRefreshToken,
  revokeRefreshToken,
} from "../db/queries/refresh.js";

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

  const accessToken = await makeJWT(user.id, 3600, config.jwt.secret);
  const refreshToken = makeRefreshToken();
  await createRefreshToken({
    token: refreshToken,
    userId: user.id,
    expiresAt: new Date(Date.now() + config.jwt.refreshDuration), // 60 days from now
  });

  const userResponse = {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: accessToken,
    refreshToken: refreshToken,
  };

  return res.status(200).json(userResponse);
};

export const handlerRefreshAccessToken = async (
  req: Request,
  res: Response
) => {
  const refreshToken = getBearerToken(req); // extract the refresh token
  const tokenCheck = await getValidRefreshToken(refreshToken); // check the token exists in the db
  // create a new access token
  // currentlt we are not doing anything with this newly created access token - we simply return it to the client
  // in prod
  const newAccessToken = await makeJWT(
    tokenCheck.userId,
    3600,
    config.jwt.secret
  );
  res.status(200).json({ token: newAccessToken });
};

// POST /api/revoke
// refreshToken is marked revoked
// accessToken is STILL VALID
export const handlerRevokeRefreshToken = async (
  req: Request,
  res: Response
) => {
  const refreshToken = getBearerToken(req); // extract the refresh token
  await getValidRefreshToken(refreshToken); // check the token exists in the db
  await revokeRefreshToken(refreshToken); // revoke the refresh token in the db
  res.status(204).send();
};
