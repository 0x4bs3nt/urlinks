import { useEffect, useRef, useState } from 'react';

const DEAD_ZONE = 10;

export function useScroll(threshold: number) {
    const [scrolled, setScrolled] = useState(false);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

            rafRef.current = requestAnimationFrame(() => {
                const currentScroll = window.scrollY;
                const upperBound = threshold + DEAD_ZONE;
                const lowerBound = threshold - DEAD_ZONE;

                setScrolled((prev) => {
                    if (currentScroll > upperBound) return true;
                    if (currentScroll <= lowerBound) return false;

                    return prev;
                });
            });
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);

            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [threshold]);

    return scrolled;
}
