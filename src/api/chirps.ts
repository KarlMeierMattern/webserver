import { Request, Response } from "express";
import { filterChirp } from "../lib/filter.js";
import { BadRequestError } from "../lib/error.js";
import { createChirps, getChirps, getChirp } from "../db/queries/chirps.js";

export const handlerCreateChirp = async (req: Request, res: Response) => {
  type params = {
    body: string;
    userId: string;
  };

  const { body, userId }: params = req.body; // express.json() middleware parses the body

  if (!body || typeof body !== "string") {
    throw new BadRequestError("Body is required and must be a string");
  }

  if (!userId || typeof userId !== "string") {
    throw new BadRequestError("userId is required and must be a string");
  }

  const fileteredChirp = filterChirp(body);

  //   if (typeof fileteredChirp !== "string") {
  //     res.status(400).json({ error: "Body must be a string" });
  //     return;
  //   }

  if (fileteredChirp.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
    // res.status(400).json({ error: "Chirp is too long" });
    // return;
  }

  const result = await createChirps({ body, userId });

  res.status(201).json(result);
};

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
