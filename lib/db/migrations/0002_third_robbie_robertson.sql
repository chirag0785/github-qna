CREATE TABLE IF NOT EXISTS "commit_summary" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"commit_id" varchar(191),
	"summary" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "commits" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"repo_id" varchar(191),
	"commit_hash" varchar NOT NULL,
	"commit_message" text NOT NULL,
	"committer" varchar NOT NULL,
	"committed_at" varchar NOT NULL,
	"avatar_url" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "repos" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(191) NOT NULL,
	"user_id" varchar(191),
	"repo_url" varchar NOT NULL,
	"personal_access_token" varchar,
	"branch" varchar DEFAULT 'master',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"name" varchar(191) NOT NULL,
	"username" varchar(191) NOT NULL,
	"email" varchar(191) NOT NULL,
	"profile_img" varchar,
	"repos" text[] DEFAULT '{}'::text[] NOT NULL,
	"credits" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "embeddings" ALTER COLUMN "embedding" SET DATA TYPE vector(768);--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "repo_id" varchar(191);--> statement-breakpoint
ALTER TABLE "resources" ADD COLUMN "content" varchar NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commit_summary" ADD CONSTRAINT "commit_summary_commit_id_commits_id_fk" FOREIGN KEY ("commit_id") REFERENCES "public"."commits"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "commits" ADD CONSTRAINT "commits_repo_id_repos_id_fk" FOREIGN KEY ("repo_id") REFERENCES "public"."repos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "repos" ADD CONSTRAINT "repos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resources" ADD CONSTRAINT "resources_repo_id_repos_id_fk" FOREIGN KEY ("repo_id") REFERENCES "public"."repos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "embeddings" DROP COLUMN IF EXISTS "content";