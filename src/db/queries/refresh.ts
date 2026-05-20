import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { refreshTokens, RefreshToken } from "../schema.js";
import { UnauthorizedError } from "../../lib/error.js";

export const createRefreshToken = async (token: RefreshToken) => {
  const [result] = await db.insert(refreshTokens).values(token).returning();
  return result;
};

export const getValidRefreshToken = async (tokenString: string) => {
  const [token] = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.token, tokenString));

  if (!token) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  if (token.expiresAt < new Date()) {
    throw new UnauthorizedError("Refresh token expired");
  }

  if (token.revokedAt !== null) {
    throw new UnauthorizedError("Refresh token revoked");
  }

  return token;
};

export const revokeRefreshToken = async (tokenString: string) => {
  const [token] = await db
    .update(refreshTokens)
    .set({ revokedAt: new Date() })
    .where(eq(refreshTokens.token, tokenString))
    .returning();
};
