import { sql } from "drizzle-orm";
import {varchar, timestamp, pgTable } from "drizzle-orm/pg-core";

import { nanoid } from "@/lib/utils";
import { repos } from "./repos";

export const resources = pgTable("resources", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  repo_id:varchar("repo_id",{length:191})
            .references(
                ()=> repos.id,
                { onDelete: 'cascade' },
            ),
  content:varchar("content").notNull(),
  repo_name: varchar("repo_name", { length: 191 }).notNull(),
  file_path: varchar("file_path", { length: 191 }).notNull(),
  summary: varchar("summary").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});
