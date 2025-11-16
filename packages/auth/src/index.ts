import { reactStartCookies } from 'better-auth/react-start';
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
// import { polar, checkout, portal } from "@polar-sh/better-auth";
// import { polarClient } from "./lib/payments";
import { db } from "@mermaid/db";
import * as schema from "@mermaid/db/schema/auth";

export const auth = betterAuth<BetterAuthOptions>({
	database: drizzleAdapter(db, {
		provider: "sqlite",

		schema: schema,
	}),
	trustedOrigins: [
		process.env.CORS_ORIGIN,
		process.env.SITE_URL,
		process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
		"http://localhost:3002",
		"http://127.0.0.1:3002",
		"http://localhost:3000",
		"http://127.0.0.1:3000",
	].filter(Boolean) as string[],
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			accessType: "offline",
			prompt: "select_account consent",
		},
		github: { 
			clientId: process.env.GITHUB_CLIENT_ID as string, 
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
		}, 
	},
	plugins: [
		// polar({
		// 	client: polarClient,
		// 	createCustomerOnSignUp: true,
		// 	enableCustomerPortal: true,
		// 	use: [
		// 		checkout({
		// 			products: [
		// 				{
		// 					productId: "your-product-id",
		// 					slug: "pro",
		// 				},
		// 			],
		// 			successUrl: process.env.POLAR_SUCCESS_URL,
		// 			authenticatedUsersOnly: true,
		// 		}),
		// 		portal(),
		// 	],
		// }),
    reactStartCookies()
  ],
});
