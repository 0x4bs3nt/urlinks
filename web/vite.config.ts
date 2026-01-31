import fs from 'fs';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const versionPath = path.resolve(__dirname, '../VERSION');
const appVersion = fs.existsSync(versionPath) ? fs.readFileSync(versionPath, 'utf-8').trim() : '0.0.0-unknown';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    define: {
        __APP_VERSION__: JSON.stringify(appVersion),
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        watch: { usePolling: true },
    },
});
