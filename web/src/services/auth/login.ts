import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

import type { AuthTokens } from '@/consts/types/auth';

interface UserLogin {
    username: string;
    password: string;
}

const BASE_URL = import.meta.env.VITE_BE_URL;

const axiosInst = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

const loginUser = async (data: UserLogin): Promise<AuthTokens> => {
    const res = await axiosInst.post<AuthTokens>('/core/token/', data);

    return res.data;
};

export const useLoginUser = () => {
    return useMutation<AuthTokens, Error, UserLogin>({
        mutationFn: (data) => loginUser(data),
    });
};
