import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: projectId } = await params;
        const { name } = await req.json();

        // Check project ownership
        const project = await prisma.project.findUnique({
            where: { id: projectId }
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        if (project.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Create blank screen
        const screen = await prisma.screen.create({
            data: {
                projectId,
                name: name || "New Screen",
                htmlContent: `<div class="flex flex-col items-center justify-center h-full p-6 bg-gray-50">
                    <p class="text-gray-500 text-center">New screen</p>
                </div>`,
                cssContent: "",
                x: Math.random() * 400 + 400,
                y: Math.random() * 400 + 100,
                width: 375,
                height: 812
            }
        });

        return NextResponse.json({ screen });
    } catch (error) {
        console.error("Error creating screen:", error);
        return NextResponse.json(
            { error: "Failed to create screen" },
            { status: 500 }
        );
    }
}
