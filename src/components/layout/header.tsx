"use client";

import Link from "next/link";
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Smartphone } from "lucide-react";
import { useTheme } from "next-themes";

export function Header() {
    const { user } = useUser();
    const { theme, setTheme } = useTheme();

    return (
        <header className="sticky top-0 z-50 w-full glass">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg text-white">
                        <Smartphone className="h-5 w-5" />
                    </div>
                    <span className="font-jakarta-sans text-xl font-bold tracking-tight text-foreground">
                        Xdesign<span className="text-primary">.ai</span>
                    </span>
                </Link>

                <nav className="hidden items-center gap-6 md:flex">
                    <Link href="/projects" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                        Projects
                    </Link>
                    <Link href="/templates" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                        Templates
                    </Link>
                    <Link href="/pricing" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                        Pricing
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="rounded-full"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="sm" asChild className="hidden sm:flex glass hover:bg-white/10">
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    ) : (
                        <SignInButton mode="modal">
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-medium">
                                Get Started
                            </Button>
                        </SignInButton>
                    )}
                </div>
            </div>
        </header>
    );
}
