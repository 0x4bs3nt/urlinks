import type { AuthTokens } from '@/consts/types/auth';

export const fetchTokens = (): AuthTokens | null => {
    const tokensString = localStorage.getItem('urlinks_tokens');

    if (!tokensString) {
        return null;
    }

    try {
        return JSON.parse(tokensString) as AuthTokens;
    } catch {
        return null;
    }
};

export const removeTokens = () => localStorage.removeItem('urlinks_tokens');

export const setTokens = (data: AuthTokens) => localStorage.setItem('urlinks_tokens', JSON.stringify(data));

export const setLsAccess = (token: string) => {
    const tokens = fetchTokens();

    if (tokens) {
        setTokens({ ...tokens, access: token });
    }
};
