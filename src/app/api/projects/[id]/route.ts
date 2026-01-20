import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET /api/projects/[id]
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const project = await prisma.project.findUnique({
            where: { id },
            include: { screens: true },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        if (project.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        return NextResponse.json(
            { error: "Failed to fetch project" },
            { status: 500 }
        );
    }
}

// PATCH /api/projects/[id]
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        // Check ownership
        const existingProject = await prisma.project.findUnique({
            where: { id },
        });

        if (!existingProject || existingProject.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const project = await prisma.project.update({
            where: { id },
            data: {
                ...body,
            },
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json(
            { error: "Failed to update project" },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/[id]
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        // Check ownership
        const existingProject = await prisma.project.findUnique({
            where: { id },
        });

        if (!existingProject || existingProject.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await prisma.project.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
}
