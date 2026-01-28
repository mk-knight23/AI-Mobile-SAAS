"use client";

import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Layout, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const templates = [
    {
        name: "Fitness App Dashboard",
        description: "Track workouts and health metrics",
        icon: "💪",
        prompt: "Fitness app dashboard with dark mode showing daily stats, workout progress, calories burned, heart rate monitoring, and exercise history"
    },
    {
        name: "Food Delivery App",
        description: "Order food with ease",
        icon: "🍔",
        prompt: "Modern food delivery app login screen with email/phone login, social login options, and forgot password option"
    },
    {
        name: "Crypto Wallet",
        description: "Manage your digital assets",
        icon: "₿",
        prompt: "Crypto wallet portfolio dashboard showing Bitcoin, Ethereum, Solana balances, recent transactions, and price charts"
    },
    {
        name: "E-commerce Store",
        description: "Beautiful shopping experience",
        icon: "🛍️",
        prompt: "E-commerce app home screen with product categories, featured products, search bar, cart icon, and promotions"
    },
    {
        name: "Social Media Feed",
        description: "Connect with friends",
        icon: "📱",
        prompt: "Social media feed with posts, likes, comments, share options, user profile pictures, and navigation bottom bar"
    },
    {
        name: "Travel Booking",
        description: "Plan your next adventure",
        icon: "✈️",
        prompt: "Travel booking app with flight search, hotel listings, destination images, booking calendar, and trip details"
    },
];

export default function TemplatesPage() {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState<string | null>(null);

    const handleUseTemplate = async (template: typeof templates[0]) => {
        setIsCreating(template.name);
        try {
            const response = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: template.prompt }),
            });

            if (!response.ok) throw new Error("Failed to create project");

            const project = await response.json();
            router.push(`/editor/${project.id}`);
        } catch (error) {
            console.error("Error creating project:", error);
            setIsCreating(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
                            <Sparkles className="w-3 h-3" />
                            Templates
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Start with a Template</h1>
                        <p className="text-muted-foreground text-lg">Choose a template to get started quickly</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map((template) => (
                            <div
                                key={template.name}
                                className="glass rounded-2xl p-6 hover:scale-105 transition-all cursor-pointer group"
                                onClick={() => handleUseTemplate(template)}
                            >
                                <div className="text-4xl mb-4">{template.icon}</div>
                                <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                                <p className="text-muted-foreground text-sm mb-4">{template.description}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                                    disabled={isCreating === template.name}
                                >
                                    {isCreating === template.name ? (
                                        <>Creating...</>
                                    ) : (
                                        "Use Template"
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-muted-foreground mb-4">Do not see what you are looking for?</p>
                        <Link href="/">
                            <Button variant="outline" className="gap-2">
                                <Layout className="w-4 h-4" />
                                Create Custom Design
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
