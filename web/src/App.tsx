import { Routes, Route, Outlet } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { Header } from './components/header';
import PrivateRoute from './app/auth/private-route';
import LoginRoute from './app/auth/login-route';
import LoginPage from './app/auth/login';

const Layout = () => (
    <>
        <Header />
        <Outlet />
    </>
);

export function App() {
    return (
        <>
            <Toaster closeButton theme="dark" richColors toastOptions={{ duration: 4000 }} />
            <Routes>
                {/* Routes with header */}
                <Route element={<Layout />}>
                    <Route path="/" element={<div>Home Page</div>} />
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<div>Dashboard - Private</div>} />
                </Route>

                {/* Public routes without header */}
                <Route element={<LoginRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
