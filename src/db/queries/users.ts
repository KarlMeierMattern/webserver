import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  // Array destructuring is used to get the first item from the returned array.
  // This is because drizzle returns an array of results, even if there is only one result.
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
