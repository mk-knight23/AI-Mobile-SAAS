import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generateText } from "ai";
import { aiModel } from "@/lib/ai";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { prompt } = await req.json();
        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        // Generate a project name using AI
        const { text: projectName } = await generateText({
            model: aiModel,
            prompt: `Generate a short, creative name (max 4 words) for a mobile app project described as: "${prompt}". Return ONLY the name.`,
        });

        const project = await prisma.project.create({
            data: {
                name: projectName.trim() || "Untitled Project",
                userId,
                promptHistory: {
                    create: {
                        content: prompt,
                        role: "user"
                    }
                }
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const projects = await prisma.project.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}
