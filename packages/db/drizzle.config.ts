import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Try to load .env file if it exists (for local development)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, "../../apps/web/.env");

if (existsSync(envPath)) {
	dotenv.config({ path: envPath });
}

// Read from environment variables (works in Vercel and local)
const databaseUrl = process.env.DATABASE_URL;
const authToken = process.env.DATABASE_AUTH_TOKEN;

if (!databaseUrl) {
	throw new Error(
		"DATABASE_URL environment variable is required. Please set it in your Vercel project settings or .env file."
	);
}

export default defineConfig({
	schema: "./src/schema",
	out: "./src/migrations",
	dialect: "turso",
	dbCredentials: {
		url: databaseUrl,
		authToken: authToken,
	},
});
