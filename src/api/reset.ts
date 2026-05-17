import { Request, Response } from "express";
import { config } from "../config.js";
import { ForbiddenError } from "../lib/error.js";
import { deleteAllUsers } from "../db/queries/users.js";
import { deleteAllChirps } from "../db/queries/chirps.js";

export const handlerReset = async (_req: Request, res: Response) => {
  if (config.api.platform !== "dev") {
    console.log(config.api.platform);
    throw new ForbiddenError("Reset is only allowed in dev environment");
  }

  await deleteAllUsers();
  await deleteAllChirps();
  config.api.fileServerHits = 0;
  res.status(200).json({ fileServerHits: config.api.fileServerHits });
};
