import { sql } from "drizzle-orm";
import {varchar, timestamp, pgTable } from "drizzle-orm/pg-core";

import { nanoid } from "@/lib/utils";

export const resources = pgTable("resources", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),

  repo_name: varchar("repo_name", { length: 191 }).notNull(),
  file_path: varchar("file_path", { length: 191 }).notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});
