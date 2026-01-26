import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen } from "lucide-react";
import Link from "next/link";

export default function ProjectsPage() {
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

                    <div className="glass rounded-3xl p-8 text-center">
                        <FolderOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
                        <p className="text-muted-foreground mb-6">Create your first AI-generated mobile app design</p>
                        <Link href="/">
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
