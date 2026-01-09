import { useNavigate } from 'react-router';

import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useRegisterUser } from '@/services/auth/register';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const formSchema = z
    .object({
        username: z.string().min(1, 'Username is required'),
        email: z.email().min(1, 'Email is required'),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
        confirm_password: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: 'Passwords do not match',
        path: ['confirm_password'],
    });

type FormValues = z.infer<typeof formSchema>;

const RegisterForm = ({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) => {
    const { mutate, isPending } = useRegisterUser();
    const navigate = useNavigate();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirm_password: '',
        },
    });

    const onSubmit = (data: FormValues) => {
        mutate(data, {
            onSuccess: () => {
                toast.success('Account created successfully! Please log in.');

                navigate('/login');
            },
        });
    };

    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Create an account</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <Form {...form}>
                            <form className="grid gap-1" onSubmit={form.handleSubmit(onSubmit)}>
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="mb-4">
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
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="mb-4">
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input autoComplete="email" placeholder="Enter your email" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="mb-2">
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input autoComplete="new-password" type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirm_password"
                                    render={({ field }) => (
                                        <FormItem className="mb-4">
                                            <FormLabel>Confirm Password</FormLabel>
                                            <FormControl>
                                                <Input autoComplete="new-password" type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button loading={isPending} type="submit" className="w-full">
                                    Create Account
                                </Button>
                            </form>
                        </Form>
                        <div className="text-center text-sm">
                            Already have an account?{' '}
                            <a
                                className="cursor-pointer underline underline-offset-4 hover:text-primary"
                                onClick={() => navigate('/login')}
                            >
                                Log in
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a> and{' '}
                <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
};

export default RegisterForm;
