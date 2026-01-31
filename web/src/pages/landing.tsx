import { useEffect } from 'react';
import { useLocation } from 'react-router';

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
        <div id="header">
            <img src="public/urlinks.svg" alt="Urlinks" />
            <p>Free & Open Source Link-in-Bio Tool - Coming soon</p>
        </div>
        // <div className="min-h-screen">
        //     <Hero />
        //     <Features />
        //     <FAQ />
        //     <CTA />
        //     <Footer />
        // </div>
    );
}
