import path from "node:path";
import type { PrismaConfig } from "prisma";
import dotenv from "dotenv";

// Load env file
dotenv.config({
	path: "../../apps/web/.env",
});

// Set a fallback DATABASE_URL if not set (for build-time generation/validation)
// This is needed for Prisma schema validation during db:generate
if (!process.env.DATABASE_URL) {
	process.env.DATABASE_URL = "file:./temp.db";
}

export default {
	schema: path.join("prisma", "schema"),
	migrations: {
		path: path.join("prisma", "migrations"),
	},
} satisfies PrismaConfig;
