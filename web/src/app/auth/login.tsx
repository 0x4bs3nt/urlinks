import { GalleryVerticalEnd } from 'lucide-react';

import LoginForm from '@/components/auth/login-form';

const LoginPage = () => {
    return (
        <div className="flex h-screen w-full items-center justify-center overflow-hidden p-4 md:p-6">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="flex items-center justify-center gap-2 text-xl font-semibold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <GalleryVerticalEnd className="size-5" />
                    </div>
                    Freetree
                </div>
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;
