import { Request, Response } from "express";
import { upgradeUser } from "../db/queries/users.js";
import { NotFoundError, UnauthorizedError } from "../lib/error.js";
import { getAPIKey } from "../auth.js";
import { config } from "../config.js";

// POST /api/polka/webhooks
// The 3rd party service is the client (e.g. Stripe) and it makes an outbound HTTP POST request to your URL
// webhooks are normal HTTP requests (normally POSTs)
// only difference is client (e.g. Stripe) defines the shape of the API contract
export const handlerPolkaEvent = async (req: Request, res: Response) => {
  type params = {
    event: string;
    data: {
      userId: string;
    };
  };

  const apiKey = getAPIKey(req);

  if (apiKey !== config.webhook.polkaKey) {
    throw new UnauthorizedError("Invalid API key");
  }

  const { event, data }: params = req.body;

  // Received webhook successfully, but don't need to do anything with it
  if (event !== "user.upgraded") {
    return res.status(204).send();
  }

  const upgradedUser = await upgradeUser(data.userId);

  if (!upgradedUser) {
    throw new NotFoundError("No user ID in payload");
  }

  return res.status(204).send();
};
