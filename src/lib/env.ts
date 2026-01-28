import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().optional().default(""),

  // Clerk Auth
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional().default(""),
  CLERK_SECRET_KEY: z.string().optional().default(""),
  CLERK_WEBHOOK_SECRET: z.string().optional().default(""),

  // AI Providers
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional().default(""),
  OPENAI_API_KEY: z.string().optional().default(""),
  MINIMAX_API_KEY: z.string().optional().default(""),

  // App Config
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default("http://localhost:3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).optional().default("development"),
});

// Validate environment variables
export function validateEnv() {
  const env = process.env as Record<string, string>;

  // Check for critical missing variables
  const missing: string[] = [];

  if (!env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !missing.includes("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY")) {
    missing.push("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
  }

  if (!env.CLERK_SECRET_KEY && !missing.includes("CLERK_SECRET_KEY")) {
    missing.push("CLERK_SECRET_KEY");
  }

  if (!env.DATABASE_URL && !missing.includes("DATABASE_URL")) {
    missing.push("DATABASE_URL");
  }

  // Check for at least one AI provider
  const hasAIProvider = env.GOOGLE_GENERATIVE_AI_API_KEY ||
    env.OPENAI_API_KEY ||
    env.MINIMAX_API_KEY;

  if (!hasAIProvider && !missing.includes("AI_PROVIDER")) {
    missing.push("AI_PROVIDER (at least one of GOOGLE_GENERATIVE_AI_API_KEY, OPENAI_API_KEY, or MINIMAX_API_KEY)");
  }

  if (missing.length > 0) {
    console.warn("⚠️  Missing environment variables:", missing.join(", "));
    console.warn("   Some features may not work correctly.");
  }

  return { isValid: missing.length === 0, missing };
}

export type Env = z.infer<typeof envSchema>;

export const env = {
  get DATABASE_URL() { return process.env.DATABASE_URL || ""; },
  get NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY() { return process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || ""; },
  get CLERK_SECRET_KEY() { return process.env.CLERK_SECRET_KEY || ""; },
  get GOOGLE_GENERATIVE_AI_API_KEY() { return process.env.GOOGLE_GENERATIVE_AI_API_KEY || ""; },
  get OPENAI_API_KEY() { return process.env.OPENAI_API_KEY || ""; },
  get MINIMAX_API_KEY() { return process.env.MINIMAX_API_KEY || ""; },
  get NEXT_PUBLIC_APP_URL() { return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"; },
  get NODE_ENV() { return process.env.NODE_ENV || "development"; },
};
