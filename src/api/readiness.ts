import { Request, Response } from "express";

export const handlerReadiness = (_req: Request, res: Response) => {
  res.set("Content-Type", "application/json; charset=utf-8");
  res.send("OK");
};
