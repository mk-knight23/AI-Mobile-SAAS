import { generateText } from "ai";
import { minimax } from "vercel-minimax-ai-provider";

// Configure Minimax as the primary AI provider
const minimaxModel = minimax("abab6.5s-chat");

export const aiModel = minimaxModel;

/**
 * Generate text using Minimax AI
 * @param prompt - The prompt to send to the AI
 * @returns The generated text
 */
export async function generateWithMinimax(prompt: string): Promise<string> {
  const { text } = await generateText({
    model: minimaxModel,
    prompt,
  });
  return text;
}

/**
 * Generate structured object using Minimax AI
 * Uses a text-based approach since Minimax doesn't support structured output directly
 * @param prompt - The prompt to send to the AI
 * @param schemaDescription - Description of the expected schema for context
 * @returns The generated text (parse as needed)
 */
export async function generateStructuredWithMinimax(
  prompt: string,
  schemaDescription: string = "response"
): Promise<string> {
  const { text } = await generateText({
    model: minimaxModel,
    prompt: `${prompt}\n\nRespond with a valid JSON object for: ${schemaDescription}.`,
  });
  return text;
}
