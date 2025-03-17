import { nanoid } from "@/lib/utils";
import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users=pgTable("users",{
    id: varchar("id", { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
    name:varchar("name",{length:191}).notNull(),
    username:varchar("username",{length:191}).notNull(),
    email:varchar("email",{length:191}).notNull(),
    profile_img:varchar("profile_img"),
    repos:text("repos")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
    createdAt: timestamp("created_at")
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at")
        .notNull()
        .default(sql`now()`),
})