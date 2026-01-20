"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Bot, Sparkles } from "lucide-react";

export function ChatSidebar({ onSend, initialPrompt }: { onSend: (message: string) => void, initialPrompt?: string }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello! I'm your AI Mobile Design Agent. What screen should we build next?" },
        ...(initialPrompt ? [{ role: "user", content: initialPrompt }] : []),
        ...(initialPrompt ? [{ role: "assistant", content: "Generating the UI for your request..." }] : [])
    ]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMessage = { role: "user", content: input };
        setMessages([...messages, userMessage]);
        onSend(input);
        setInput("");

        // Simulate AI response logic
        setTimeout(() => {
            setMessages((prev) => [...prev, { role: "assistant", content: "Generating the UI for your request..." }]);
        }, 1000);
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
            </div>

            <div className="p-4 border-t">
                <div className="relative">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe a change..."
                        className="pr-12 rounded-xl h-12 glass border-white/20"
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <Button
                        size="icon"
                        className="absolute right-1 top-1 h-10 w-10 rounded-lg"
                        onClick={handleSend}
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
