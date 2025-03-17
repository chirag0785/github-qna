import { nanoid } from "@/lib/utils";
import { pgTable, varchar,timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { sql } from "drizzle-orm";

export const repos=pgTable("repos",{
    id: varchar("id", { length: 191 })
            .primaryKey()
            .$defaultFn(() => nanoid()),
    name:varchar("name",{length:191}).notNull(),
    user_id:varchar("user_id",{length:191})
                .references(
                    ()=> users.id,
                    { onDelete: 'cascade' }
                ),
    createdAt: timestamp("created_at")
        .notNull()
        .default(sql`now()`),
    updatedAt: timestamp("updated_at")
        .notNull()
        .default(sql`now()`),
})