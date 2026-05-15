import { Request, Response } from "express";
import { config } from "../config.js";

export const handlerReset = (_req: Request, res: Response) => {
  config.fileServerHits = 0;
  res.status(200).json({ fileServerHits: config.fileServerHits });
};
