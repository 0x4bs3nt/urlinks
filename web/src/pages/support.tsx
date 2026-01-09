import { useEffect } from 'react';
import { Heart, Code, Coffee } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/landing/footer';

const otherWays = [
    {
        icon: Code,
        title: 'Contribute Code',
        description: 'Help us build freetree by contributing code, fixing bugs, or improving documentation.',
        action: 'View GitHub',
        href: 'https://github.com/0x4bs3nt/freetree',
    },
    {
        icon: Heart,
        title: 'Spread the Word',
        description: 'Share freetree with your friends, on social media, or write about it on your blog.',
        action: 'Share Now',
        href: '#',
    },
];

export default function SupportPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 pb-24 pt-12 md:pt-20">
                <div className="mx-auto max-w-4xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="space-y-4">
                        <Badge variant="secondary" className="w-fit mx-auto text-sm">
                            Support Open Source
                        </Badge>
                        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                            Help keep{' '}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                freetree free
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground md:text-2xl max-w-2xl mx-auto">
                            Freetree is free and open source, but running infrastructure and development costs money.
                            Your support helps us keep the lights on and improve the platform for everyone.
                        </p>
                    </div>
                </div>
            </section>

            {/* Ko-fi Support Section */}
            <section className="relative px-4 py-12">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 rounded-3xl blur-3xl" />
                <div className="relative mx-auto max-w-2xl">
                    <Card className="p-12 bg-muted/30 animate-in fade-in zoom-in-95 duration-1000 delay-150">
                        <div className="space-y-8 text-center">
                            <div className="inline-flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
                                <Coffee className="size-10" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-3xl font-bold">Support us on Ko-fi</h2>
                                <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                                    Buy us a coffee and help keep freetree running. Every contribution goes directly
                                    towards server costs and development.
                                </p>
                            </div>
                            <div className="pt-2">
                                <Button size="lg" className="px-8 text-lg h-14" asChild>
                                    <a href="https://ko-fi.com/4bs3nt" target="_blank" rel="noopener noreferrer">
                                        <Coffee className="mr-2 size-5" />
                                        Support on Ko-fi
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Other Ways to Support */}
            <section className="px-4 py-24 bg-muted/30">
                <div className="mx-auto max-w-4xl">
                    <div className="space-y-4 text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Other ways to support</h2>
                        <p className="text-xl text-muted-foreground">
                            Can't donate? There are other ways to help freetree thrive.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {otherWays.map((way, index) => {
                            const Icon = way.icon;
                            return (
                                <Card
                                    key={index}
                                    className="p-8 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 duration-1000"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="space-y-6">
                                        <div className="inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <Icon className="size-6" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-semibold">{way.title}</h3>
                                            <p className="text-muted-foreground">{way.description}</p>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Thank You Section */}
            <section className="px-4 py-24">
                <div className="mx-auto max-w-3xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-1000">
                    <div className="inline-flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto">
                        <Heart className="size-10 fill-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Thank you for your support!</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Every contribution, big or small, helps us keep freetree free and open source for everyone. We
                        couldn't do this without you.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
