import { NextFunction, Request, Response } from "express";
import { config } from "./config.js";

export const middlewareLogResponses = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // .on method allows you to listen for events on the response object
  res.on("finish", () => {
    const statusCode = res.statusCode;
    if (statusCode >= 200) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
    }
  });
  next();
};

export const middlewareMetricsInc = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  config.fileServerHits++;
  next();
};
