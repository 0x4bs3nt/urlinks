import { Routes, Route, Outlet } from 'react-router';
import { Toaster } from './components/ui/sonner';
import { Header } from './components/header';
import PrivateRoute from './app/auth/private-route';
import LoginRoute from './app/auth/login-route';
import LoginPage from './app/auth/login';
import LandingPage from './pages/landing';
import SupportPage from './pages/support';
import RegisterPage from './app/auth/register';

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
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/donate" element={<SupportPage />} />
                    <Route path="/privacy" element={<div>Privacy Policy - Coming Soon</div>} />
                    <Route path="/terms" element={<div>Terms of Service - Coming Soon</div>} />
                </Route>

                <Route element={<PrivateRoute />}>
                    <Route path="/dashboard" element={<div>Dashboard - Private</div>} />
                </Route>

                {/* Public routes without header */}
                <Route element={<LoginRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
