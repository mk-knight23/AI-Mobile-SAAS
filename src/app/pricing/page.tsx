import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";

const plans = [
    {
        name: "Free",
        price: "$0",
        description: "Perfect for trying out the platform",
        features: [
            "3 projects per month",
            "5 screens per project",
            "Basic AI generation",
            "PNG export",
            "Community support",
        ],
        current: false,
    },
    {
        name: "Pro",
        price: "$19",
        period: "/month",
        description: "For designers and developers",
        features: [
            "Unlimited projects",
            "Unlimited screens",
            "Advanced AI generation",
            "PNG & HTML export",
            "Priority support",
            "Version history",
            "Team collaboration",
        ],
        current: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large teams and organizations",
        features: [
            "Everything in Pro",
            "Custom AI models",
            "API access",
            "SSO & SAML",
            "Dedicated support",
            "Custom integrations",
            "SLA guarantee",
        ],
        current: false,
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4">
                            <Sparkles className="w-3 h-3" />
                            Pricing
                        </div>
                        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
                        <p className="text-muted-foreground text-lg">Choose the plan that works for you</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`glass rounded-3xl p-8 ${
                                    plan.current ? "border-2 border-primary scale-105" : ""
                                }`}
                            >
                                {plan.current && (
                                    <div className="text-center mb-4">
                                        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    {plan.period && (
                                        <span className="text-muted-foreground">{plan.period}</span>
                                    )}
                                </div>
                                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 text-sm">
                                            <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    className="w-full"
                                    variant={plan.current ? "default" : "outline"}
                                >
                                    {plan.name === "Free" ? "Get Started" : plan.name === "Enterprise" ? "Contact Sales" : "Upgrade"}
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-muted-foreground mb-4">All plans include a 14-day free trial</p>
                        <p className="text-sm text-muted-foreground">
                            Questions? <a href="#" className="text-primary hover:underline">Contact us</a> for custom solutions
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
