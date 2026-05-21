import { asc } from "drizzle-orm/sql/expressions/select";
import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export const createChirps = async (chirp: NewChirp) => {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();

  return result;
};

export const deleteAllChirps = async () => {
  await db.delete(chirps);
};

export const getChirps = async () => {
  return await db.select().from(chirps).orderBy(asc(chirps.createdAt));
};

export const getChirp = async (chirpId: string) => {
  const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpId));
  return result;
};

export const deleteChirp = async (chirpId: string) => {
  const [result] = await db
    .delete(chirps)
    .where(eq(chirps.id, chirpId))
    .returning();
};
