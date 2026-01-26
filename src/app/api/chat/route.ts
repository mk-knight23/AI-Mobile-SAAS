import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages, projectId } = await req.json();

        // Get the last user message
        const lastMessage = messages[messages.length - 1];
        const userPrompt = lastMessage?.content || "";

        // Generate a response
        const { object } = await generateObject({
            model: google("gemini-2.0-flash-exp"),
            schema: z.object({
                text: z.string().describe("The AI assistant's response"),
                suggestedAction: z.string().optional().describe("Any suggested action for the user"),
            }),
            prompt: `You are an AI mobile UI design assistant.
            User message: "${userPrompt}"

            ${projectId ? `Current project ID: ${projectId}` : ""}

            Respond helpfully to the user's message about mobile app design.
            Keep your response concise and actionable.`,
        });

        return NextResponse.json({ text: object.text });
    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json(
            { text: "Sorry, I couldn't process your request. Please try again." },
            { status: 500 }
        );
    }
}
