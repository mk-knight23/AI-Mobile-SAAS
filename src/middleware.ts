import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/chat(.*)",
  "/api/projects(.*)", // Allow project creation (auth handled in route)
  "/api/generate(.*)", // Allow generate (auth handled in route)
]);

const isEditorRoute = createRouteMatcher(["/editor(.*)"]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  // Allow public routes
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Editor routes require authentication
  if (isEditorRoute(request)) {
    const { userId } = await auth.protect();
    return NextResponse.next();
  }

  // All other routes require auth
  await auth.protect();
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
