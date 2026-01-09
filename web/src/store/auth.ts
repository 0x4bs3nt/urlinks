import { create } from 'zustand';

import { fetchTokens, removeTokens } from '@/lib/localStorage';

interface TokenType {
    id: number | null;
    username: string | null;
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
    access: tokens?.access || null,
    refresh: tokens?.refresh || null,

    setAll: (data: TokenType) => set(data),
    setAccessToken: (access: string) => set({ access }),
    setRefreshToken: (refresh: string) => set({ refresh }),

    logout: () => {
        removeTokens();

        set({ access: null, refresh: null });
    },
}));
