import { foreignKey } from "drizzle-orm/gel-core";
import { pgTable, timestamp, varchar, uuid, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()), // sets the updatedAt field to a default value whenever the row is updated
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashedPassword: varchar("hashed_password"), // allow existing users to have no password
});

// $inferInsert is a helper type that infers the type of the object you would pass to the insert function.
// This is useful for type safety.
export type NewUser = typeof users.$inferInsert;

export const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  body: text("body").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export type NewChirp = typeof chirps.$inferInsert;
