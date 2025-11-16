import { defineConfig } from "drizzle-kit";

// Read from environment variables (works in Vercel and local)
// For local development, ensure DATABASE_URL is set in your .env file
// For Vercel, set it in project environment variables
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
