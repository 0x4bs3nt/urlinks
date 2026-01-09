import { Link2, BarChart3, Palette, Smartphone, Lock, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Card } from '@/components/ui/card';

interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
}

const features: Feature[] = [
    {
        icon: Link2,
        title: 'Unlimited Links',
        description: 'Add as many links as you want. No artificial limits, no premium tiers.',
    },
    {
        icon: BarChart3,
        title: 'Advanced Analytics',
        description: 'Track clicks, views, and engagement with detailed insights.',
    },
    {
        icon: Palette,
        title: 'Custom Themes',
        description: 'Personalize your page with beautiful themes and custom branding.',
    },
    {
        icon: Smartphone,
        title: 'Mobile Optimized',
        description: 'Perfect on every device. Fast, responsive, and accessible.',
    },
    {
        icon: Lock,
        title: 'Privacy First',
        description: 'Your data belongs to you. Open source and transparent.',
    },
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Built for speed. Your audience deserves instant loading.',
    },
];

export function Features() {
    return (
        <section id="features" className="px-4 py-24 bg-muted/30">
            <div className="mx-auto max-w-6xl">
                <div className="space-y-4 text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                        Everything you need, <span className="text-primary">nothing you don't</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Powerful features that are completely free, forever.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={idx}
                                className="group relative overflow-hidden p-6 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 duration-1000"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                <div className="relative space-y-4">
                                    <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Icon className="size-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
