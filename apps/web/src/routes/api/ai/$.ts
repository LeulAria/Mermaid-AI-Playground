import { createFileRoute } from "@tanstack/react-router";
import { google } from "@ai-sdk/google";
import { streamText, type UIMessage, convertToModelMessages } from "ai";
import { SYSTEM_PROMPT } from "./_constants";


export const Route = createFileRoute("/api/ai/$")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = await request.json();
					
					// Validate request body
					if (!body || !body.messages || !Array.isArray(body.messages)) {
						return new Response(
							JSON.stringify({ error: "Invalid request: messages array is required" }),
							{
								status: 400,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					let { messages }: { messages: UIMessage[] } = body;

					// Check for API key
					if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
						console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
						return new Response(
							JSON.stringify({ error: "Google AI API key is not configured" }),
							{
								status: 500,
								headers: { "Content-Type": "application/json" },
							},
						);
					}

					// Normalize messages: convert simple {role, content} format to {role, parts} format
					messages = messages.map((msg: any) => {
						// If message has 'content' instead of 'parts', convert it
						if (msg.content && !msg.parts) {
							return {
								...msg,
								parts: [{ type: "text" as const, text: msg.content }],
								content: undefined, // Remove content to avoid confusion
							};
						}
						// If message already has parts, ensure it's in the correct format
						if (msg.parts && Array.isArray(msg.parts)) {
							return msg;
						}
						// Fallback: if neither content nor parts, create empty parts
						return {
							...msg,
							parts: [],
						};
					});

					// Convert messages and prepend system prompt
					const modelMessages = convertToModelMessages(messages);
					
					// Add system message at the beginning if not already present
					const systemMessage = { role: "system" as const, content: SYSTEM_PROMPT };
					const messagesWithSystem = [systemMessage, ...modelMessages];

					const result = streamText({
						model: google("gemini-2.0-flash"),
						messages: messagesWithSystem,
					});

					return result.toUIMessageStreamResponse();
				} catch (error) {
					console.error("AI API error:", error);
					const errorMessage = error instanceof Error ? error.message : "Unknown error";
					const errorStack = error instanceof Error ? error.stack : undefined;
					
					// Check if it's a Google API error
					if (error instanceof Error && error.message.includes("API key")) {
						return new Response(
							JSON.stringify({ 
								error: "Google AI API key is invalid or missing",
								details: errorMessage,
							}),
							{
								status: 500,
								headers: { "Content-Type": "application/json" },
							},
						);
					}
					
					return new Response(
						JSON.stringify({ 
							error: "Failed to process AI request",
							details: errorMessage,
							...(errorStack && process.env.NODE_ENV === "development" && { stack: errorStack }),
						}),
						{
							status: 500,
							headers: { "Content-Type": "application/json" },
						},
					);
				}
			},
		},
	},
});
