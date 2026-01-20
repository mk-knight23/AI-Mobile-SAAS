"use client";

import { Button } from "@/components/ui/button";
import {
    Save,
    Trash2,
    History,
    ChevronDown,
    Share2,
    Undo2,
    Redo2,
    Plus
} from "lucide-react";

export function EditorToolbar() {
    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 p-1 shadow-2xl glass rounded-2xl bg-white/20">
            <div className="flex items-center gap-1 border-r pr-1 mr-1 border-white/10 text-foreground">
                <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl gap-2 hover:bg-white/10 text-foreground">
                    <History className="h-4 w-4" />
                    Version History
                </Button>
            </div>

            <div className="flex items-center gap-1 text-foreground">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/10 text-foreground">
                    <Undo2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/10 text-foreground">
                    <Redo2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 px-1 border-x border-white/10">
                <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl gap-2 hover:bg-white/10 text-foreground">
                    <Plus className="h-4 w-4" />
                    Add Screen
                </Button>
            </div>

            <div className="flex items-center gap-1 pl-1 text-foreground">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white/10 text-foreground">
                    <Share2 className="h-4 w-4" />
                </Button>
                <Button size="sm" className="h-9 px-4 rounded-xl gap-2 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg ml-1">
                    <Save className="h-4 w-4" />
                    Save Project
                </Button>
            </div>
        </div>
    );
}
