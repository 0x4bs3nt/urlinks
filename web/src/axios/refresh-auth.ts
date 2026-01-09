import axios, { type AxiosError } from 'axios';

import { fetchTokens, removeTokens, setLsAccess } from '@/lib/localStorage';
import { setHeaderToken } from '.';

interface RefreshTokenResponse {
    access: string;
}

const BASE_URL = import.meta.env.VITE_BE_URL;

const axiosInst = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

export const fetchNewToken = async (): Promise<string | null> => {
    const tokens = fetchTokens();

    try {
        const response = await axiosInst.post<RefreshTokenResponse>('/core/token/refresh/', {
            refresh: tokens?.refresh,
        });

        return response.data.access;
    } catch {
        return null;
    }
};

export const refreshAuth = async (failedRequest: AxiosError) => {
    const newToken = await fetchNewToken();

    if (newToken && failedRequest.response) {
        failedRequest.response.config.headers.Authorization = `Bearer ${newToken}`;

        setHeaderToken(newToken);
        setLsAccess(newToken);

        return Promise.resolve(newToken);
    } else {
        removeTokens();
        window.location.href = '/login';

        return Promise.reject(new Error('Failed to refresh authentication'));
    }
};
