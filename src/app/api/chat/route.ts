import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
    const { prompt } = await req.json();

    const result = await streamObject({
        model: google("gemini-1.5-pro-latest"), // Or gemini-2.0-flash-exp when available
        schema: z.object({
            screens: z.array(z.object({
                name: z.string(),
                html: z.string(),
                css: z.string(),
            })),
        }),
        prompt: `You are an expert mobile UI designer. 
    Design a mobile app based on this prompt: "${prompt}"
    
    Rules:
    - Use Tailwind CSS for styling in the HTML.
    - Keep CSS block empty if all styles are in Tailwind.
    - Return a list of screens (e.g. Onboarding, Login, Dashboard).
    - Ensure the UI looks modern, premium, and functional.
    - Use Lucide-like icon names or standard SVG placeholders.
    - Use "Plus Jakarta Sans" font.
    - For images, use Unsplash URLs: https://images.unsplash.com/photo-[ID]?q=80&w=1000
    - Or use descriptive placeholder URLs: https://source.unsplash.com/featured/?<keyword>
    `,
    });

    return result.toTextStreamResponse();
}
