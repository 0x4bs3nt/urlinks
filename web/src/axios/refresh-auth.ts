import axios, { type AxiosError } from 'axios';
import { toast } from 'sonner';

import { removeHeaderToken, setHeaderToken } from '.';
import { fetchTokens, setTokens } from '@/lib/localStorage';
import { clearAuthStore, useAuthStore } from '@/store/auth';

interface RefreshTokenResponse {
    access: string;
    refresh: string;
}

const BASE_URL = import.meta.env.VITE_BE_URL;

const refreshClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const fetchNewToken = async (): Promise<RefreshTokenResponse | null> => {
    const tokens = fetchTokens();
    if (!tokens?.refresh) {
        return null;
    }

    try {
        const response = await refreshClient.post<RefreshTokenResponse>('/core/token/refresh/', {
            refresh: tokens?.refresh,
        });

        return response.data;
    } catch {
        return null;
    }
};

export const refreshAuth = async (failedRequest: AxiosError) => {
    const refreshedTokens = await fetchNewToken();

    if (refreshedTokens && failedRequest.response?.config.headers) {
        failedRequest.response.config.headers.Authorization = `Bearer ${refreshedTokens.access}`;

        const currentTokens = fetchTokens();
        if (currentTokens) {
            const nextTokens = {
                ...currentTokens,
                access: refreshedTokens.access,
                refresh: refreshedTokens.refresh,
            };

            setTokens(nextTokens);
            useAuthStore.getState().setAll(nextTokens);
        }

        setHeaderToken(refreshedTokens.access);

        return Promise.resolve(refreshedTokens.access);
    } else {
        removeHeaderToken();
        clearAuthStore();
        toast.error('Your session has ended. Please log in again.');
        window.location.href = '/login';

        return Promise.reject(new Error('Failed to refresh authentication'));
    }
};
