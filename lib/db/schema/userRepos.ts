import { pgTable, varchar,timestamp,primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users";
import { sql } from "drizzle-orm";
import { repos } from "./repos";

export const userRepos=pgTable("user_repos",{
    user_id:varchar("user_id",{length:191})
                .references(
                    ()=> users.id,
                    { onDelete: 'cascade' }
                ),
    repo_id: varchar("repo_id",{length:191})
                .references(
                    ()=> repos.id,
                    {onDelete:'cascade'}
                ),
    createdAt: timestamp("created_at")
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at")
        .notNull()
        .default(sql`now()`),
},(table)=> ({
    pk: primaryKey({
        columns: [table.user_id,table.repo_id]
    }),
}));