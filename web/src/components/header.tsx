import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { MenuIcon, XIcon, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

import { useScroll } from '@/hooks/use-scroll';
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
// import { useAuthStore } from '@/store/auth';

type MobileMenuProps = React.ComponentProps<'div'> & {
    open: boolean;
};

const links = [
    {
        label: 'Features',
        href: '#',
    },
];

const Header = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    // const authToken = useAuthStore((state) => state.access);
    // const username = useAuthStore((state) => state.username);
    // const userID = useAuthStore((state) => state.id);
    // const profile_picture = useAuthStore((state) => state.profile_picture);

    // const logout = useAuthStore((state) => state.logout);

    const username = 'JohnDoe';

    const logout = () => console.log('Logged out');

    const isLoggedIn = false;

    const scrolled = useScroll(10);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);

    return (
        <header
            className={cn(
                'sticky top-0 p-[1rem] z-50 mb-4 mx-auto w-full max-w-6xl border-transparent border-b md:rounded-md md:border md:transition-all md:ease-out',
                {
                    'border-border bg-background/95 backdrop-blur-lg supports-backdrop-filter:bg-background/50 p-1 md:top-4 md:max-w-5xl md:shadow':
                        scrolled,
                }
            )}
        >
            <nav
                className={cn(
                    'flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out',
                    {
                        'md:px-2': scrolled,
                    }
                )}
            >
                <a
                    className="rounded-md p-2 text-xl font-bold cursor-pointer hover:text-primary"
                    onClick={() => navigate('/')}
                >
                    FREETREE
                </a>
                <div className="hidden items-center gap-4 md:flex">
                    {links.map((link, idx) => (
                        <Link
                            className={buttonVariants({ variant: 'ghost', className: 'text-lg' })}
                            to={link.href}
                            key={idx}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <div className="hidden items-center gap-4 md:flex">
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex cursor-pointer items-center gap-3">
                                    {username && <span className="text-md font-medium">{username}</span>}
                                    <Avatar>
                                        {/* <AvatarImage src={profile_picture || ''} alt="User avatar" /> */}
                                        <AvatarFallback>
                                            <User className="size-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            {/* <DropdownMenuContent align="end"> */}
                            {/*     <DropdownMenuItem onClick={() => navigate(`/profile/${userID}`)}> */}
                            {/*         Profile */}
                            {/*     </DropdownMenuItem> */}
                            {/*     <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem> */}
                            {/* </DropdownMenuContent> */}
                        </DropdownMenu>
                    ) : (
                        <>
                            <Button onClick={() => navigate('/login')} variant="outline">
                                Sign In
                            </Button>
                            <Button onClick={() => navigate('/register')}>Get Started</Button>
                        </>
                    )}
                </div>
                <Button className="md:hidden" onClick={() => setOpen(!open)} size="icon" variant="outline">
                    {open ? <XIcon className="size-4.5" /> : <MenuIcon className="size-4.5" />}
                </Button>
            </nav>

            <MobileMenu className="flex flex-col justify-between gap-2" open={open}>
                <div className="grid gap-y-2">
                    {links.map((link, idx) => (
                        <Link
                            className={buttonVariants({ variant: 'ghost', className: 'text-lg' })}
                            to={link.href}
                            key={idx}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <div className="flex flex-col gap-2">
                    {isLoggedIn ? (
                        <>
                            <Button
                                className="w-full justify-start"
                                onClick={() => navigate('/profile')}
                                variant="ghost"
                            >
                                <Avatar className="mr-2 size-6">
                                    <AvatarImage src="" alt="User avatar" />
                                    <AvatarFallback>
                                        <User className="size-3" />
                                    </AvatarFallback>
                                </Avatar>
                                {username || 'Profile'}
                            </Button>
                            <Button className="w-full" onClick={logout} variant="outline">
                                Log out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                className="w-full bg-transparent"
                                variant="outline"
                                onClick={() => navigate('/login')}
                            >
                                Sign In
                            </Button>
                            <Button onClick={() => navigate('/register')} className="w-full">
                                Get Started
                            </Button>
                        </>
                    )}
                </div>
            </MobileMenu>
        </header>
    );
};

const MobileMenu = ({ open, children, className, ...props }: MobileMenuProps) => {
    if (!open || typeof window === 'undefined') return null;

    return createPortal(
        <div
            className={cn(
                'bg-background/95 backdrop-blur-lg supports-backdrop-filter:bg-background/50',
                'fixed top-24 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y md:hidden'
            )}
            id="mobile-menu"
        >
            <div
                className={cn(
                    'data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in',
                    'size-full p-4',
                    className
                )}
                data-slot={open ? 'open' : 'closed'}
                {...props}
            >
                {children}
            </div>
        </div>,
        document.body
    );
};

export { Header };
