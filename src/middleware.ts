import { NextFunction, Request, Response } from "express";
import { config } from "./config.js";
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from "./lib/error.js";

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
  config.api.fileServerHits++;
  next();
};

export const middlewareErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(`Error processing ${req.method} ${req.url}:`, error);
  if (error instanceof BadRequestError) {
    return res.status(400).json({ error: error.message });
  } else if (error instanceof UnauthorizedError) {
    return res.status(401).json({ error: error.message });
  } else if (error instanceof ForbiddenError) {
    return res.status(403).json({ error: error.message });
  } else if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message });
  } else {
    return res.status(500).json({ error: "Something went wrong on our end" });
  }
};
