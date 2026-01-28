"use client";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, Sparkles, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

interface Project {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    screens?: { id: string }[];
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await fetch("/api/projects");
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data.projects || []);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProjects();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">My Projects</h1>
                            <p className="text-muted-foreground mt-2">Manage and continue your design projects</p>
                        </div>
                        <Link href="/">
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                New Project
                            </Button>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="glass rounded-3xl p-8 text-center">
                            <div className="animate-pulse flex flex-col items-center gap-4">
                                <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="glass rounded-3xl p-8 text-center">
                            <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
                            <p className="text-muted-foreground mb-6">Create your first AI-generated mobile app design</p>
                            <Link href="/">
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/editor/${project.id}`}
                                    className="glass rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                            <Sparkles className="w-6 h-6 text-primary" />
                                        </div>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors truncate">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {project.screens?.length || 0} screens
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
