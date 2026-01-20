import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generateObject } from "ai";
import { aiModel } from "@/lib/ai";
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { projectId, prompt, screenId } = await req.json();

        if (!projectId || !prompt) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Verify project ownership
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project || project.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const systemPrompt = `
        You are an expert mobile app UI designer and developer.
        Your task is to generate a beautiful, modern, and responsive mobile app screen based on the user's description.
        
        Output Requirements:
        1. HTML: semantic HTML structure. Use Tailwind CSS classes for styling.
        2. CSS: Only if custom CSS is absolutely necessary and cannot be achieved with Tailwind. otherwise empty string.
        3. Name: A short, descriptive name for the screen (e.g., "Login Screen", "Dashboard").
        4. Description: A brief explanation of the design choices.
        
        Design Guidelines:
        - Use a mobile-first approach (width 375px).
        - Use modern UI trends (rounded corners, soft shadows, ample whitespace).
        - Ensure good contrast and accessibility.
        - Use Tailwind CSS for all styling (e.g., bg-blue-500, text-white, rounded-xl).
        - Assume a dark mode or light mode context based on the prompt (default to light/neutral if unspecified).
        `;

        const { object: screenData } = await generateObject({
            model: aiModel,
            prompt: `Project Context: ${project.name}.
            User Prompt: ${prompt}.
            Generate a comprehensive mobile screen design.`,
            system: systemPrompt,
            schema: z.object({
                name: z.string(),
                description: z.string(),
                htmlContent: z.string(),
                cssContent: z.string(),
            }),
        });

        // Save to database
        const screen = await prisma.screen.create({
            data: {
                projectId,
                name: screenData.name,
                htmlContent: screenData.htmlContent,
                cssContent: screenData.cssContent,
                width: 375, // Default mobile width
                height: 812, // Default mobile height
            }
        });

        // Log the prompt
        await prisma.promptHistory.create({
            data: {
                projectId,
                content: prompt,
                role: "user"
            }
        });

        return NextResponse.json({ screen });
    } catch (error) {
        console.error("Error generating screen:", error);
        return NextResponse.json(
            { error: "Failed to generate screen" },
            { status: 500 }
        );
    }
}
