"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Smartphone, Clock, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
    id: string;
    name: string;
    thumbnail?: string | null;
    createdAt: string;
}

interface ProjectsResponse {
    projects: Project[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
    };
}

export function RecentProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await fetch("/api/projects?limit=3");
                if (res.ok) {
                    const data: ProjectsResponse = await res.json();
                    setProjects(data.projects || []);
                } else {
                    setError("Failed to load projects");
                }
            } catch (err) {
                console.error("Failed to fetch projects", err);
                setError("Failed to load projects");
            } finally {
                setIsLoading(false);
            }
        }
        fetchProjects();
    }, []);

    if (isLoading) {
        return (
            <section className="py-20 px-4 flex justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error || projects.length === 0) return null;

    return (
        <section className="py-20 px-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-bold tracking-tight font-jakarta-sans">
                        Recent Projects
                    </h2>
                    <Button variant="ghost" className="gap-2" onClick={() => router.push("/projects")}>
                        View All <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            onClick={() => router.push(`/editor/${project.id}`)}
                            className="group relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        >
                            {/* Thumbnail */}
                            <div className="aspect-video bg-slate-100 dark:bg-slate-900 relative flex items-center justify-center overflow-hidden">
                                {project.thumbnail ? (
                                    <img
                                        src={project.thumbnail}
                                        alt={project.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Layout className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                                )}

                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white font-medium flex items-center gap-2">
                                        Open Editor <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="font-semibold text-lg mb-2 truncate">{project.name}</h3>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Smartphone className="w-3 h-3" />
                                        Mobile App
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
