import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { toast } from 'sonner';
import axios from 'axios';

import App from './App.tsx';
import './index.css';
import type { ErrorResponse } from './consts/types/error.ts';

const queryClient = new QueryClient({
    defaultOptions: {
        mutations: {
            onError: (err) => {
                if (axios.isAxiosError<ErrorResponse>(err) && err.status === 400) {
                    const errorMessage = err.response?.data?.error;

                    if (errorMessage) toast.error(errorMessage);
                }
            },
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
        </BrowserRouter>
    </QueryClientProvider>
);
