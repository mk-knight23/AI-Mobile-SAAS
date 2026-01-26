import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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

        // Get screen and check ownership
        const screen = await prisma.screen.findUnique({
            where: { id },
            include: { project: true }
        });

        if (!screen) {
            return NextResponse.json({ error: "Screen not found" }, { status: 404 });
        }

        if (screen.project.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await prisma.screen.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting screen:", error);
        return NextResponse.json(
            { error: "Failed to delete screen" },
            { status: 500 }
        );
    }
}

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
        const { name, htmlContent, cssContent, x, y, width, height } = await req.json();

        // Get screen and check ownership
        const screen = await prisma.screen.findUnique({
            where: { id },
            include: { project: true }
        });

        if (!screen) {
            return NextResponse.json({ error: "Screen not found" }, { status: 404 });
        }

        if (screen.project.userId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const updatedScreen = await prisma.screen.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(htmlContent && { htmlContent }),
                ...(cssContent && { cssContent }),
                ...(x !== undefined && { x }),
                ...(y !== undefined && { y }),
                ...(width && { width }),
                ...(height && { height }),
            }
        });

        return NextResponse.json({ screen: updatedScreen });
    } catch (error) {
        console.error("Error updating screen:", error);
        return NextResponse.json(
            { error: "Failed to update screen" },
            { status: 500 }
        );
    }
}
