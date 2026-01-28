"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface ChatSidebarProps {
    projectId: string;
    onSend?: (message: string) => void;
    initialPrompt?: string;
    isGenerating?: boolean;
}

export function ChatSidebar({ projectId, onSend, initialPrompt, isGenerating = false }: ChatSidebarProps) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I'm your AI Mobile Design Agent. Describe what screen you'd like to create or modify." }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // Handle initial prompt
    useEffect(() => {
        if (initialPrompt) {
            setMessages(prev => [
                ...prev,
                { role: "user", content: initialPrompt }
            ]);
        }
    }, [initialPrompt]);

    const handleSend = useCallback(async () => {
        if (!input.trim() || isLoading || isGenerating) return;

        const userMessage = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);
        setIsTyping(true);

        try {
            // Call the chat API
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, { role: "user", content: userMessage }],
                    projectId
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Chat failed");
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.text }]);

            // Also trigger screen generation if requested
            if (onSend) {
                onSend(userMessage);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Sorry, I couldn't process your request. Please try again."
            }]);
            toast.error("Failed to get AI response");
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    }, [input, isLoading, isGenerating, messages, projectId, onSend]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-[350px] border-l glass flex flex-col h-full font-jakarta-sans shadow-xl">
            <div className="p-4 border-b flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
                <h3 className="font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI Designer
                </h3>
                <span className="text-xs text-muted-foreground">
                    {isGenerating ? "Generating..." : "Ready"}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m, idx) => (
                    <div key={idx} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            m.role === "assistant"
                                ? "bg-primary text-white"
                                : "bg-slate-200 dark:bg-slate-700"
                        }`}>
                            {m.role === "assistant" ? (
                                <Bot className="w-4 h-4" />
                            ) : (
                                <User className="w-4 h-4" />
                            )}
                        </div>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            m.role === "assistant"
                                ? "bg-slate-50 dark:bg-slate-800 rounded-tl-sm"
                                : "bg-primary text-white rounded-tr-sm"
                        }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="max-w-[80%] p-3 rounded-2xl text-sm bg-slate-50 dark:bg-slate-800 rounded-tl-sm flex items-center gap-2">
                            <span className="flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                            </span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t bg-white/50 dark:bg-slate-900/50">
                <div className="relative">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe a change or new screen..."
                        className="pr-12 rounded-xl h-12 glass border-white/20"
                        onKeyDown={handleKeyDown}
                        disabled={isLoading || isGenerating}
                        maxLength={1000}
                    />
                    <Button
                        size="icon"
                        className="absolute right-1 top-1 h-10 w-10 rounded-lg"
                        onClick={handleSend}
                        disabled={isLoading || isGenerating || !input.trim()}
                    >
                        {isLoading || isGenerating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}
