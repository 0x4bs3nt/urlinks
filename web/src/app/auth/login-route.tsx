import { Navigate, Outlet } from 'react-router';

import { useAuthStore } from '@/store/auth';

const LoginRoute = () => {
    const authToken = useAuthStore((state) => state.access);

    return !authToken ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default LoginRoute;
