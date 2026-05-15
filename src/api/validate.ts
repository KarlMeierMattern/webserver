import { Request, Response } from "express";
import { filterChirp } from "../lib/filter.js";

export const handlerValidateChirp = (req: Request, res: Response) => {
  const { body } = req.body; // express.json() middleware parses the body

  const fileteredChirp = filterChirp(body);

  if (typeof fileteredChirp !== "string") {
    res.status(400).json({ error: "Body must be a string" });
    return;
  }

  if (fileteredChirp.length > 140) {
    res.status(400).json({ error: "Chirp is too long" });
    return;
  }

  res.status(200).json({ cleanedBody: fileteredChirp });
};
