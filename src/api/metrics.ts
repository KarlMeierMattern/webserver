import { Request, Response } from "express";
import { config } from "../config.js";

export const handlerMetrics = (_req: Request, res: Response) => {
  //   res.status(200).json({ fileServerHits: config.fileserverHits });
  res.set("Content-Type", "text/html; charset=utf-8");

  // render admin.html
  res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileServerHits} times!</p>
  </body>
</html>`);
};
