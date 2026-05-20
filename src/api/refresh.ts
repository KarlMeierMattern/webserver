import { Request, Response } from "express";
import { getBearerToken, makeJWT } from "../auth.js";
import {
  getValidRefreshToken,
  revokeRefreshToken,
} from "../db/queries/refresh.js";
import { config } from "../config.js";

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
