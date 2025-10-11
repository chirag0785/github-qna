import { nanoid } from "@/lib/utils";
import { pgTable, varchar,timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const repos=pgTable("repos",{
    id: varchar("id", { length: 191 })
            .primaryKey()
            .$defaultFn(() => nanoid()),
    name:varchar("name",{length:191}).notNull(),
    repo_url:varchar("repo_url").notNull(),
    personal_access_token:varchar("personal_access_token"),
    branch:varchar("branch").default("master"),
    createdAt: timestamp("created_at")
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at")
        .notNull()
        .default(sql`now()`),
})