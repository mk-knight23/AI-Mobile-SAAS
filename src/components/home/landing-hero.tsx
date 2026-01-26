"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, Smartphone, Layout, Zap, Image as ImageIcon, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const suggestions = [
    {
        label: "Fitness App Dashboard",
        icon: <Zap className="w-3 h-3" />,
        prompt: "Fitness app dashboard with dark mode showing daily stats, workout progress, calories burned, heart rate monitoring, and exercise history"
    },
    {
        label: "Food Delivery Login",
        icon: <Layout className="w-3 h-3" />,
        prompt: "Modern food delivery app login screen with email/phone login, social login options, and forgot password option"
    },
    {
        label: "Crypto Wallet Portfolio",
        icon: <ImageIcon className="w-3 h-3" />,
        prompt: "Crypto wallet portfolio dashboard showing Bitcoin, Ethereum, Solana balances, recent transactions, and price charts"
    },
    {
        label: "Onboarding Screens",
        icon: <ArrowRight className="w-3 h-3" />,
        prompt: "Beautiful onboarding screens with welcome screen, feature highlights, and get started CTA for a mobile app"
    },
];

export function LandingHero() {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [creatingTemplate, setCreatingTemplate] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e?: React.FormEvent, customPrompt?: string) => {
        const finalPrompt = customPrompt || prompt;
        if (!finalPrompt.trim() || isLoading) return;

        setIsLoading(true);
        try {
            const response = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: finalPrompt }),
            });

            if (!response.ok) throw new Error("Failed to create project");

            const project = await response.json();
            router.push(`/editor/${project.id}`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setCreatingTemplate(null);
        }
    };

    const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
        setCreatingTemplate(suggestion.label);
        handleSubmit(undefined, suggestion.prompt);
    };

    return (
        <section className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 pt-10 pb-20 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10" />
            <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-cta/10 blur-[100px] rounded-full -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-4xl"
            >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground font-jakarta-sans">
                    Design Mobile Apps <br />
                    <span className="text-primary italic">In Minutes, Not Days.</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                    Describe your vision, and our AI design agent will build a production-grade
                    mobile UI on a draggable canvas. Ready to export or deploy.
                </p>

                <form
                    onSubmit={(e) => handleSubmit(e)}
                    className="w-full max-w-3xl mx-auto glass p-2 rounded-2xl flex items-center gap-2 mb-8"
                >
                    <div className="flex-1 px-4">
                        <input
                            type="text"
                            placeholder="I want to design a fitness app dashboard with dark mode..."
                            className="w-full bg-transparent border-none outline-none text-foreground py-3 placeholder:text-muted"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <Button type="submit" size="lg" className="rounded-xl px-8 h-12 bg-primary hover:bg-primary/90" disabled={isLoading}>
                        {isLoading ? (
                            <>Generating <span className="animate-pulse">...</span></>
                        ) : (
                            <>
                                Design
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="flex flex-wrap justify-center gap-3">
                    {suggestions.map((s) => (
                        <button
                            key={s.label}
                            onClick={() => handleSuggestionClick(s)}
                            disabled={creatingTemplate === s.label}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl glass hover:bg-white/10 transition-all text-sm font-medium text-foreground cursor-pointer disabled:opacity-50"
                        >
                            {creatingTemplate === s.label ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                                s.icon
                            )}
                            {creatingTemplate === s.label ? "Creating..." : s.label}
                        </button>
                    ))}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-20 relative w-full max-w-5xl mx-auto"
            >
                <div className="aspect-video glass rounded-3xl overflow-hidden p-4 border-white/20 shadow-2xl relative">
                    <div className="absolute top-4 left-4 flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="w-full h-full bg-white/5 rounded-2xl flex items-center justify-center">
                        <Smartphone className="w-24 h-24 text-primary/20" />
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
