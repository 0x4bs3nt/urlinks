import { Link as RouterLink } from 'react-router';

import { Github, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Hero() {
    return (
        <section className="relative overflow-hidden px-4 pb-24 pt-12 md:pt-20">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
                        <div className="space-y-4">
                            <Badge variant="secondary" className="w-fit text-sm">
                                100% Free & Open Source
                            </Badge>
                            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                                Your links,{' '}
                                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                    your way
                                </span>
                            </h1>
                            <p className="text-xl text-muted-foreground md:text-2xl max-w-2xl">
                                Because paying for link-in-bio tools doesn't make sense. Share all your content with one
                                link, for free.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Button size="lg" className="text-lg h-12 px-8" asChild>
                                <RouterLink to="/register">
                                    Get Started Free
                                    <ArrowRight className="ml-2 size-5" />
                                </RouterLink>
                            </Button>
                            <Button size="lg" variant="outline" className="text-lg h-12 px-8" asChild>
                                <a href="https://github.com/0x4bs3nt/urlinks" target="_blank" rel="noopener noreferrer">
                                    <Github className="mr-2 size-5" />
                                    View on GitHub
                                </a>
                            </Button>
                        </div>
                    </div>
                    <div className="relative lg:h-[600px] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 rounded-3xl blur-3xl" />
                        <div className="relative h-full flex items-center justify-center">
                            <div className="w-full max-w-sm space-y-4 rounded-2xl border bg-card p-8 shadow-2xl">
                                <div className="space-y-3">
                                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/60 mx-auto" />
                                    <h3 className="text-center text-xl font-bold">@yourname</h3>
                                    <p className="text-center text-sm text-muted-foreground">Your bio goes here</p>
                                </div>
                                <div className="space-y-3 pt-4">
                                    {[1, 2, 3].map((i) => (
                                        <div
                                            key={i}
                                            className="h-14 rounded-xl border pulse-link"
                                            style={{ animationDelay: `${i * 0.5}s` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
