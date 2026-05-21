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

// POST /api/login
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

  const accessToken = await makeJWT(
    user.id,
    config.jwt.defaultDuration,
    config.jwt.secret
  );
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
    isChirpyRed: user.isChirpyRed,
  };

  return res.status(200).json(userResponse);
};

// POST /api/refresh
// In prod if client detects 401 to route requiring authorisation like POST /api/chirps, calls /api/refresh, gets a new access token
// Client retries POST /api/chirps with the new token
// The refresh/retry logic belongs on the client side — this is the standard OAuth2 pattern
export const handlerRefreshAccessToken = async (
  req: Request,
  res: Response
) => {
  const refreshToken = getBearerToken(req); // extract the refresh token
  const tokenCheck = await getValidRefreshToken(refreshToken); // check the token exists in the db
  // create a new access token - in prod, the client would save this new access token to cookies or local storage
  const newAccessToken = await makeJWT(
    tokenCheck.userId,
    config.jwt.defaultDuration,
    config.jwt.secret
  );
  await revokeRefreshToken(refreshToken); // revoke access to refreshToken
  const newRefreshToken = await createNewRefreshToken(tokenCheck.userId); // create new refreshToken
  res
    .status(200)
    .json({ token: newAccessToken, refreshToken: newRefreshToken });
};

// POST /api/revoke - refreshToken is marked revoked, but accessToken is still valid
// this endpoint is for explicit logout - we only want to revoke not issue a new token
export const handlerRevokeRefreshToken = async (
  req: Request,
  res: Response
) => {
  const refreshToken = getBearerToken(req); // extract the refresh token
  await getValidRefreshToken(refreshToken); // check the token exists in the db
  await revokeRefreshToken(refreshToken); // revoke the refresh token in the db
  res.status(204).send();
};

const createNewRefreshToken = async (userId: string) => {
  const refreshToken = makeRefreshToken();
  await createRefreshToken({
    token: refreshToken,
    userId: userId,
    expiresAt: new Date(Date.now() + config.jwt.refreshDuration), // 60 days from now
  });

  return refreshToken;
};
