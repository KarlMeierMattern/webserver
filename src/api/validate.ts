import { Request, Response } from "express";
import { filterChirp } from "../lib/filter.js";
import { BadRequestError } from "../lib/error.js";

export const handlerValidateChirp = (req: Request, res: Response) => {
  const { body } = req.body; // express.json() middleware parses the body

  const fileteredChirp = filterChirp(body);

  if (typeof fileteredChirp !== "string") {
    throw new BadRequestError("Body must be a string");
  }

  if (fileteredChirp.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  res.status(200).json({ cleanedBody: fileteredChirp });
};
