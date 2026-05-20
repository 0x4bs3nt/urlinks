import { create } from 'zustand';

import { fetchTokens, removeTokens } from '@/lib/localStorage';

interface TokenType {
    id: number | null;
    username: string | null;
    email: string | null;
    session_id: string | null;
    access: string | null;
    refresh: string | null;
}

interface AuthStore extends TokenType {
    setAll: (data: TokenType) => void;
    setAccessToken: (access: string) => void;
    setRefreshToken: (refresh: string) => void;
    logout: () => void;
}

const tokens = fetchTokens();

export const useAuthStore = create<AuthStore>((set) => ({
    id: tokens?.id || null,
    username: tokens?.username || null,
    email: tokens?.email || null,
    session_id: tokens?.session_id || null,
    access: tokens?.access || null,
    refresh: tokens?.refresh || null,

    setAll: (data: TokenType) => set(data),
    setAccessToken: (access: string) => set({ access }),
    setRefreshToken: (refresh: string) => set({ refresh }),

    logout: () => {
        removeTokens();

        set({
            id: null,
            username: null,
            email: null,
            session_id: null,
            access: null,
            refresh: null,
        });
    },
}));

export const clearAuthStore = () => {
    useAuthStore.getState().logout();
};
