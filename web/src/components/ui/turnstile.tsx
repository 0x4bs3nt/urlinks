import * as React from 'react';
import { Turnstile as TurnstileWidget } from '@marsidev/react-turnstile';

interface TurnstileProps {
    onSuccess: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
}

const SITE_KEY = import.meta.env.VITE_CF_TURNSTILE_SITE_KEY || '';
const IS_DEV = import.meta.env.DEV;
const SHOULD_BYPASS = IS_DEV && !SITE_KEY;

function Turnstile({ onSuccess, onError, onExpire }: TurnstileProps) {
    React.useEffect(() => {
        if (SHOULD_BYPASS) {
            const timer = setTimeout(() => {
                onSuccess('dev-mode-bypass-token');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [onSuccess]);

    if (SHOULD_BYPASS) {
        return (
            <div className="flex items-center justify-center rounded-md border border-dashed border-muted-foreground/50 bg-muted/30 p-4 text-sm text-muted-foreground">
                <span>Captcha bypassed (dev mode)</span>
            </div>
        );
    }

    return (
        <TurnstileWidget
            siteKey={SITE_KEY}
            options={{
                theme: 'auto',
                size: 'flexible',
            }}
            onSuccess={onSuccess}
            onError={onError}
            onExpire={onExpire}
        />
    );
}

export { Turnstile };
