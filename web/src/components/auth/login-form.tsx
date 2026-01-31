import { useState } from 'react';
import { useNavigate } from 'react-router';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useLoginUser } from '@/services/auth/login';
import { useAuthStore } from '@/store/auth';
import { setTokens } from '@/lib/localStorage';
import { setHeaderToken } from '@/axios';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Turnstile } from '../ui/turnstile';
import { cn } from '@/lib/utils';

const formSchema = z.object({
    username: z.string().min(1, { message: 'Username is required' }),
    password: z.string().min(1, { message: 'Password is required' }),
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm = ({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) => {
    const { mutate, isPending } = useLoginUser();
    const navigate = useNavigate();
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

    const setAll = useAuthStore((state) => state.setAll);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = (data: FormValues) => {
        if (!turnstileToken) {
            return;
        }

        mutate(
            { ...data, 'cf-turnstile-response': turnstileToken },
            {
                onSuccess: (res) => {
                    setTokens(res);
                    setHeaderToken(res.access);

                    setAll({
                        id: res.id,
                        username: res.username || data.username,
                        email: res.email,
                        access: res.access,
                        refresh: res.refresh,
                    });
                },
            }
        );
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <Form {...form}>
                            {}
                            <form className="grid gap-1" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="mb-6">
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    autoComplete="username"
                                                    placeholder="Enter your username"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="mb-4">
                                            <div className="flex justify-between">
                                                <FormLabel>Password</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Input autoComplete="on" type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="mb-4">
                                    <Turnstile
                                        onSuccess={(token) => setTurnstileToken(token)}
                                        onExpire={() => setTurnstileToken(null)}
                                    />
                                </div>
                                <Button loading={isPending} type="submit" className="w-full" disabled={!turnstileToken}>
                                    Login
                                </Button>
                            </form>
                        </Form>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{' '}
                            <a
                                className="underline cursor-pointer underline-offset-4 hover:text-primary"
                                onClick={() => navigate('/register')}
                            >
                                Sign up
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
};

export default LoginForm;
