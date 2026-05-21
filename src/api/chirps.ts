import { Request, Response } from "express";
import { filterChirp } from "../lib/filter.js";
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
} from "../lib/error.js";
import { createChirps, getChirps, getChirp } from "../db/queries/chirps.js";
import { validateJWT, getBearerToken } from "../auth.js";
import { config } from "../config.js";

export const handlerCreateChirp = async (req: Request, res: Response) => {
  type params = {
    body: string;
  };

  const { body }: params = req.body; // express.json() middleware parses the body
  const token = getBearerToken(req);

  if (!body || typeof body !== "string") {
    throw new BadRequestError("Body is required and must be a string");
  }

  if (!token) {
    throw new ForbiddenError("Authorization token is required");
  }

  const userId = await validateJWT(token, config.jwt.secret);

  if (!userId) {
    throw new UnauthorizedError("Invalid token");
  }

  const fileteredChirp = filterChirp(body);

  if (fileteredChirp.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const result = await createChirps({ body, userId });

  res.status(201).json(result);
};

// GET /api/chirps
export const handlerGetChirps = async (_req: Request, res: Response) => {
  const result = await getChirps();

  if (!result) {
    throw new BadRequestError("Failed to get chirps");
  }
  return res.status(200).json(result);
};

export const handlerGetChirp = async (req: Request, res: Response) => {
  type params = {
    chirpId: string;
  };

  const { chirpId }: params = req.params as { chirpId: string };

  if (!chirpId || typeof chirpId !== "string") {
    throw new BadRequestError("chirpId is required and must be a string");
  }

  const result = await getChirp(chirpId);

  if (!result) {
    throw new BadRequestError("Failed to get chirp");
  }

  return res.status(200).json(result);
};
