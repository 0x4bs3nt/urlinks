import { Routes, Route } from 'react-router';
import { Toaster } from './components/ui/sonner';
import LandingPage from './pages/landing';

// const Layout = () => (
//     <>
//         <Header />
//         <Outlet />
//     </>
// );

export function App() {
    return (
        <>
            <Toaster closeButton theme="dark" richColors toastOptions={{ duration: 4000 }} />
            <Routes>
                {/* Temporary landing page. */}
                <Route path="/" element={<LandingPage />} />

                {/* Routes with header */}
                {/* <Route element={<Layout />}> */}
                {/*     <Route path="/donate" element={<SupportPage />} /> */}
                {/*     <Route path="/privacy" element={<div>Privacy Policy - Coming Soon</div>} /> */}
                {/*     <Route path="/terms" element={<div>Terms of Service - Coming Soon</div>} /> */}
                {/* </Route> */}

                {/* <Route element={<PrivateRoute />}> */}
                {/*     <Route path="/dashboard" element={<DashboardLayout />}> */}
                {/*         <Route index element={<DashboardHome />} /> */}
                {/*         <Route path="links" element={<DashboardLinks />} /> */}
                {/*         <Route path="analytics" element={<DashboardAnalytics />} /> */}
                {/*     </Route> */}
                {/* </Route> */}

                {/* Public routes without header */}
                {/* <Route element={<LoginRoute />}> */}
                {/*     <Route path="/login" element={<LoginPage />} /> */}
                {/*     <Route path="/register" element={<RegisterPage />} /> */}
                {/* </Route> */}
            </Routes>
        </>
    );
}

export default App;
