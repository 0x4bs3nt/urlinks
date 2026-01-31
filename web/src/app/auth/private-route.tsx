import { Navigate, Outlet } from 'react-router';

import { useAuthStore } from '@/store/auth';

const PrivateRoute = () => {
    const authToken = useAuthStore((state) => state.access);

    return authToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
