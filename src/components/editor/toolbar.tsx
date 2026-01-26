"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Save,
    Trash2,
    History,
    ChevronDown,
    Share2,
    Undo2,
    Redo2,
    Plus,
    Loader2
} from "lucide-react";
import { toast } from "sonner";

interface EditorToolbarProps {
    projectId: string;
    onSave?: () => Promise<void>;
    onAddScreen?: () => Promise<void>;
    onUndo?: () => void;
    onRedo?: () => void;
    onVersionHistory?: () => void;
    onShare?: () => void;
}

export function EditorToolbar({
    projectId,
    onSave,
    onAddScreen,
    onUndo,
    onRedo,
    onVersionHistory,
    onShare
}: EditorToolbarProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const handleSave = async () => {
        if (!onSave) return;
        setIsSaving(true);
        try {
            await onSave();
            toast.success("Project saved successfully");
        } catch (error) {
            toast.error("Failed to save project");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddScreen = async () => {
        if (!onAddScreen) return;
        setIsAdding(true);
        try {
            await onAddScreen();
            toast.success("New screen added");
        } catch (error) {
            toast.error("Failed to add screen");
        } finally {
            setIsAdding(false);
        }
    };

    const handleShare = () => {
        if (onShare) {
            onShare();
        } else {
            // Copy share link
            const shareUrl = `${window.location.origin}/editor/${projectId}`;
            navigator.clipboard.writeText(shareUrl);
            toast.success("Share link copied to clipboard");
        }
    };

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 p-1 shadow-2xl glass rounded-2xl bg-white/20">
            <div className="flex items-center gap-1 border-r pr-1 mr-1 border-white/10 text-foreground">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 rounded-xl gap-2 hover:bg-white/10 text-foreground"
                    onClick={onVersionHistory}
                >
                    <History className="h-4 w-4" />
                    Version History
                </Button>
            </div>

            <div className="flex items-center gap-1 text-foreground">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl hover:bg-white/10 text-foreground"
                    onClick={onUndo}
                >
                    <Undo2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl hover:bg-white/10 text-foreground"
                    onClick={onRedo}
                >
                    <Redo2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex items-center gap-1 px-1 border-x border-white/10">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 rounded-xl gap-2 hover:bg-white/10 text-foreground"
                    onClick={handleAddScreen}
                    disabled={isAdding}
                >
                    {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Add Screen
                </Button>
            </div>

            <div className="flex items-center gap-1 pl-1 text-foreground">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl hover:bg-white/10 text-foreground"
                    onClick={handleShare}
                >
                    <Share2 className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    className="h-9 px-4 rounded-xl gap-2 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg ml-1"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Project
                </Button>
            </div>
        </div>
    );
}
