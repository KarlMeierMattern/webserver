import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  // Drizzle returns an array of results, even if there is only one result - array destructuring is used to get the first item
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteAllUsers() {
  await db.delete(users);
}

export const getUserByEmail = async (email: string) => {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return result;
};

export const updateUser = async (user: {
  id: string;
  email: string;
  hashedPassword: string;
}) => {
  // Drizzle returns an array of results, even if there is only one result - array destructuring is used to get the first item
  const [result] = await db
    .update(users)
    .set({ email: user.email, hashedPassword: user.hashedPassword })
    .where(eq(users.id, user.id))
    .returning();
  return result;
};

export const upgradeUser = async (userId: string) => {
  const [result] = await db
    .update(users)
    .set({ isChirpyRed: true })
    .where(eq(users.id, userId))
    .returning();

  return result;
};
