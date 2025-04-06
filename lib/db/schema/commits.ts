import { nanoid } from '@/lib/utils';
import { pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { repos } from './repos';

export const commits = pgTable(
  'commits',
  {
    id: varchar('id', { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    repo_id: varchar('repo_id', { length: 191 })
      .references(() => repos.id, { onDelete: 'cascade' }),
    commit_hash: varchar('commit_hash').notNull(),
    commit_message: text('commit_message').notNull(),
    committer: varchar('committer').notNull(),
    committed_at: varchar('committed_at').notNull(),
    avatar_url: varchar('avatar_url').notNull(),
  },
);