import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { axiosInstance } from '@/axios';

export interface ActiveSession {
    id: string;
    is_current: boolean;
    user_agent: string;
    ip_address: string | null;
    created_at: string;
    last_seen_at: string;
    expires_at: string;
}

const sessionQueryKey = ['auth', 'sessions'];

const fetchSessions = async (): Promise<ActiveSession[]> => {
    const response = await axiosInstance.get<ActiveSession[]>('/core/sessions/');
    return response.data;
};

const revokeSession = async (sessionId: string) => {
    const response = await axiosInstance.post(`/core/sessions/${sessionId}/revoke/`);
    return response.data;
};

const revokeOtherSessions = async () => {
    const response = await axiosInstance.post('/core/sessions/revoke-others/');
    return response.data as { detail: string; revoked_count: number };
};

const logout = async () => {
    const response = await axiosInstance.post('/core/logout/');
    return response.data;
};

export const useSessions = () =>
    useQuery({
        queryKey: sessionQueryKey,
        queryFn: fetchSessions,
    });

export const useRevokeSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: revokeSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sessionQueryKey });
        },
    });
};

export const useRevokeOtherSessions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: revokeOtherSessions,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sessionQueryKey });
        },
    });
};

export const useLogout = () => {
    return useMutation({
        mutationFn: logout,
        throwOnError: (error) => axios.isAxiosError(error) && error.response?.status !== 401,
    });
};
