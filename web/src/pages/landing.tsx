import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { FAQ } from '@/components/landing/faq';
import { CTA } from '@/components/landing/cta';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const element = document.querySelector(location.hash);

            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);

    return (
        <div className="min-h-screen">
            <Hero />
            <Features />
            <FAQ />
            <CTA />
            <Footer />
        </div>
    );
}
