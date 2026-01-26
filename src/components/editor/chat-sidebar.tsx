"use client";

import { useState, useRef, useEffect } from "react";
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
}

export function ChatSidebar({ projectId, onSend, initialPrompt }: ChatSidebarProps) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I'm your AI Mobile Design Agent. Describe what screen you'd like to create or modify." }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialPrompt) {
            setMessages(prev => [
                ...prev,
                { role: "user", content: initialPrompt }
            ]);
        }
    }, [initialPrompt]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

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
                throw new Error("Chat failed");
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: "assistant", content: data.text }]);

            // Also trigger screen generation if requested
            if (onSend) {
                onSend(userMessage);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I couldn't process your request. Please try again." }]);
            toast.error("Failed to get AI response");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-[350px] border-l glass flex flex-col h-full font-jakarta-sans shadow-xl">
            <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI Designer
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m, idx) => (
                    <div key={idx} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${m.role === "assistant" ? "bg-primary text-white" : "bg-slate-200"}`}>
                            {m.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === "assistant" ? "bg-slate-50 dark:bg-slate-800" : "bg-primary text-white"}`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="max-w-[80%] p-3 rounded-2xl text-sm bg-slate-50 dark:bg-slate-800 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
                <div className="relative">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe a change or new screen..."
                        className="pr-12 rounded-xl h-12 glass border-white/20"
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        disabled={isLoading}
                    />
                    <Button
                        size="icon"
                        className="absolute right-1 top-1 h-10 w-10 rounded-lg"
                        onClick={handleSend}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
