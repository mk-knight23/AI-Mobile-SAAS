"use client";

import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Plus, FolderOpen, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Project {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    screens?: { id: string }[];
}

export default function DashboardPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await fetch("/api/projects");
                if (res.ok) {
                    const data = await res.json();
                    // API returns { projects: [...], pagination: {...} }
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
                            <h1 className="text-3xl font-bold">Dashboard</h1>
                            <p className="text-muted-foreground mt-2">Welcome back! Here are your recent projects.</p>
                        </div>
                        <Link href="/">
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                New Project
                            </Button>
                        </Link>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <FolderOpen className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Projects</p>
                                    <p className="text-2xl font-bold">{projects.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Screens Created</p>
                                    <p className="text-2xl font-bold">
                                        {projects.reduce((acc, p) => acc + (p.screens?.length || 0), 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Last Activity</p>
                                    <p className="text-lg font-semibold">
                                        {projects[0]
                                            ? formatDistanceToNow(new Date(projects[0].updatedAt), { addSuffix: true })
                                            : "No activity"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Projects */}
                    <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
                    {isLoading ? (
                        <div className="glass rounded-2xl p-8 text-center">
                            <p className="text-muted-foreground">Loading projects...</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="glass rounded-2xl p-8 text-center">
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
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {project.screens?.length || 0} screens
                                    </p>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="mt-12">
                        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/">
                                <Button variant="outline" className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Create New Design
                                </Button>
                            </Link>
                            <Link href="/templates">
                                <Button variant="outline" className="gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Browse Templates
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
