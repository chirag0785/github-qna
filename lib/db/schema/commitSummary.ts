import { pgTable ,varchar,text} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { commits } from "./commits";

export const commitSummary = pgTable(
  'commit_summary',
    {
        id: varchar('id', { length: 191 })
        .primaryKey()
        .$defaultFn(() => nanoid()),
        commit_id: varchar('commit_id', { length: 191 })
        .references(() => commits.id, { onDelete: 'cascade' }),
        summary: text('summary').notNull(),
    },
)