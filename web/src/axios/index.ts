import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import { fetchTokens } from '@/lib/localStorage';
import { refreshAuth } from './refresh-auth';

const BASE_URL = import.meta.env.VITE_BE_URL;

const tokens = fetchTokens();

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: tokens ? `Bearer ${tokens.access}` : null,
    },
});

export const setHeaderToken = (token: string) => {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeHeaderToken = () => {
    delete axiosInstance.defaults.headers.common['Authorization'];
};

createAuthRefreshInterceptor(axiosInstance, refreshAuth, {
    statusCodes: [401],
});
