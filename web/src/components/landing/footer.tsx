import { Link as RouterLink } from 'react-router';

import { Github } from 'lucide-react';

import { Separator } from '@/components/ui/separator';

export function Footer() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <footer className="border-t px-4 py-12 bg-background">
            <div className="mx-auto max-w-6xl">
                <div className="grid gap-12 md:grid-cols-4">
                    <div className="space-y-4 md:col-span-2">
                        <h3 className="text-2xl font-bold">urlinks</h3>
                        <p className="text-muted-foreground max-w-sm">
                            The free and open source link-in-bio tool that puts you in control.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://github.com/0x4bs3nt/urlinks"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Github className="size-6" />
                            </a>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold">Product</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <button
                                    onClick={() => scrollToSection('features')}
                                    className="hover:text-primary cursor-pointer transition-colors"
                                >
                                    Features
                                </button>
                            </li>
                            <li>
                                <RouterLink to="/support" className="hover:text-primary transition-colors">
                                    Support Us
                                </RouterLink>
                            </li>
                            <li>
                                <a
                                    href="https://github.com/0x4bs3nt/urlinks"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    GitHub
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold">Legal</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <RouterLink to="/privacy" className="hover:text-primary transition-colors">
                                    Privacy Policy
                                </RouterLink>
                            </li>
                            <li>
                                <RouterLink to="/terms" className="hover:text-primary transition-colors">
                                    Terms of Service
                                </RouterLink>
                            </li>
                        </ul>
                    </div>
                </div>
                <Separator className="my-8" />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} urlinks. Open source and free forever.</p>
                </div>
            </div>
        </footer>
    );
}
