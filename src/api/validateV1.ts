// TCP layer — raw bytes arrive over the network socket
// Node.js http module — wraps the socket as a Readable stream and exposes it as req
// data event — fires as chunks arrive; by default chunks are Buffer objects (binary), but since HTTP bodies are usually UTF-8 text, Node coerces them to strings when you concatenate with +=
// end event — fires when all chunks have arrived; at this point reqBody is the complete raw string
// JSON.parse — parses that string into a JavaScript object
// express.json() does the exact same thing internally, but also handles encoding detection, size limits, and content-type checking.

import { Request, Response } from "express";

// req is a Readable stream, and you're manually buffering the chunks into a string, then parsing
export const handlerValidateChirp = (req: Request, res: Response) => {
  // We can manually read the body using Node.js streams

  let reqBody = ""; // Initialise a string buffer to accumulate the incoming JSON data

  // Listen for 'data' events – Each time a chunk of data arrives, append it to your string buffer
  req.on("data", (chunk) => {
    reqBody += chunk; // buffer objects (binary) chunks are coerced to strings when concatenated
  });

  let parsedBody: { body?: string };

  // Listen for 'end' events – Once there's no more data coming in, parse your accumulated string as JSON
  req.on("end", () => {
    try {
      parsedBody = JSON.parse(reqBody); // parse accumulated string into JavaScript object
    } catch (error) {
      res.status(400).json({ error: "Invalid JSON in request body" });
      return;
    }

    const { body } = parsedBody;

    if (typeof body !== "string") {
      res.status(400).json({ error: "Body must be a string" });
      return;
    }

    if (body.length > 140) {
      res.status(400).json({ error: "Chirp is too long" });
      return;
    }

    res.status(200).json({ valid: true });
  });
};
