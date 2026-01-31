import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

interface RegisterData {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
}

interface RegisterResponse {
    username: string;
    email: string;
    password: string;
}

const BASE_URL = import.meta.env.VITE_BE_URL;

const axiosInst = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

const registerUser = async (data: RegisterData): Promise<RegisterResponse> => {
    const res = await axiosInst.post<RegisterResponse>('/core/register/', data);

    return res.data;
};

export const useRegisterUser = () => {
    return useMutation<RegisterResponse, Error, RegisterData>({
        mutationFn: (data) => registerUser(data),
    });
};
