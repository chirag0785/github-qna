import type { Config } from "drizzle-kit";
import "dotenv/config"
console.log(process.env.DATABASE_URL);
export default {
  schema: "./lib/db/schema",
  dialect: "postgresql",
  out: "./lib/db/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  }
} satisfies Config;