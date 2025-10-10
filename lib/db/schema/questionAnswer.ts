import { sql } from "drizzle-orm";
import {varchar, timestamp, pgTable, jsonb } from "drizzle-orm/pg-core";

import { nanoid } from "@/lib/utils";
import { repos } from "./repos";
import { users } from "./users";
type File={
    name: string;
    content:string;
    summary:string;
}
export const qsAnswers = pgTable("qsAnswers", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  repo_id:varchar("repo_id",{length:191})
            .references(
                ()=> repos.id,
                { onDelete: 'cascade' },
            ),
  user_id: varchar("user_id",{length: 191})
            .references(
              ()=> users.id,
              {onDelete: 'cascade'}
            ),
  profile_img: varchar("profile_img"),
  question: varchar("question").notNull(),
  answer: varchar("answer").notNull(),
  filesReferenced: jsonb("filesReferenced").notNull().default([]),  //should be File[] here
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});
