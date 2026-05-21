import { Request, Response } from "express";
import { filterChirp } from "../lib/filter.js";
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from "../lib/error.js";
import {
  createChirps,
  getChirps,
  getChirp,
  deleteChirp,
} from "../db/queries/chirps.js";
import { validateJWT, getBearerToken } from "../auth.js";
import { config } from "../config.js";

// POST /api/chirps
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

  // Authenticated users can only create chirps for themselves, not for others
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

// GET /api/chirps/:chirpId
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
    throw new NotFoundError("Chirp not found");
  }

  return res.status(200).json(result);
};

// DELETE /api/chirps/:chirpId
export const handlerDeleteChirp = async (req: Request, res: Response) => {
  const token = getBearerToken(req);
  const userId = await validateJWT(token, config.jwt.secret);

  type params = { chirpId: string };

  const { chirpId }: params = req.params as params;
  const chirp = await getChirp(chirpId);

  if (!chirp) {
    throw new NotFoundError("Chirp not found");
  }

  if (chirp.userId !== userId) {
    throw new ForbiddenError("Not your chirp");
  }

  await deleteChirp(chirpId);

  res.status(204).send();
};
