import * as React from 'react';

declare global {
    interface Window {
        turnstile: {
            render: (
                container: string | HTMLElement,
                options: {
                    sitekey: string;
                    theme?: 'light' | 'dark' | 'auto';
                    size?: 'normal' | 'flexible' | 'compact';
                    callback?: (token: string) => void;
                    'error-callback'?: () => void;
                    'expired-callback'?: () => void;
                }
            ) => string;
            reset: (widgetId: string) => void;
            remove: (widgetId: string) => void;
        };
    }
}

interface TurnstileProps {
    onSuccess: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
}

const SITE_KEY = import.meta.env.VITE_CF_TURNSTILE_SITE_KEY || '';
const IS_DEV = import.meta.env.DEV;
const SHOULD_BYPASS = IS_DEV && !SITE_KEY;

function Turnstile({ onSuccess, onError, onExpire }: TurnstileProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const widgetIdRef = React.useRef<string | null>(null);
    const callbacksRef = React.useRef({ onSuccess, onError, onExpire });

    React.useLayoutEffect(() => {
        callbacksRef.current = { onSuccess, onError, onExpire };
    });

    React.useEffect(() => {
        if (SHOULD_BYPASS) {
            const timer = setTimeout(() => {
                callbacksRef.current.onSuccess('dev-mode-bypass-token');
            }, 500);
            return () => clearTimeout(timer);
        }

        if (!containerRef.current) return;

        const renderWidget = () => {
            if (!window.turnstile || !containerRef.current) return;
            if (widgetIdRef.current) return;

            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey: SITE_KEY,
                theme: 'auto',
                size: 'normal',
                callback: (token: string) => callbacksRef.current.onSuccess(token),
                'error-callback': () => callbacksRef.current.onError?.(),
                'expired-callback': () => callbacksRef.current.onExpire?.(),
            });
        };

        if (window.turnstile) {
            renderWidget();
        } else {
            const checkInterval = setInterval(() => {
                if (window.turnstile) {
                    clearInterval(checkInterval);
                    renderWidget();
                }
            }, 100);

            return () => clearInterval(checkInterval);
        }

        return () => {
            if (widgetIdRef.current && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, []);

    if (SHOULD_BYPASS) {
        return (
            <div className="flex items-center justify-center rounded-md border border-dashed border-muted-foreground/50 bg-muted/30 p-4 text-sm text-muted-foreground">
                <span>Captcha bypassed (dev mode)</span>
            </div>
        );
    }

    return <div ref={containerRef} />;
}

export { Turnstile };
