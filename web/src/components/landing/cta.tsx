import { Link as RouterLink } from 'react-router';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function CTA() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);

        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="px-4 py-24 bg-muted/30">
            <div className="mx-auto max-w-4xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-1000">
                <div className="space-y-4">
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Ready to get started?</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">C'mon — it's free! Try it out.</p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Button size="lg" className="text-lg h-12 px-8" asChild>
                        <RouterLink to="/register">
                            Create Your Free Page
                            <ArrowRight className="ml-2 size-5" />
                        </RouterLink>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="text-lg h-12 px-8"
                        onClick={() => scrollToSection('features')}
                    >
                        Learn More
                    </Button>
                </div>
            </div>
        </section>
    );
}
