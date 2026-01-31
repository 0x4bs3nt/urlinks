/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

interface ImportMetaEnv {
    readonly VITE_BE_URL: string;
    readonly VITE_CF_TURNSTILE_SITE_KEY?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
