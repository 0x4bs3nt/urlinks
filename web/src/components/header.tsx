import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { MenuIcon, XIcon, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';

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
        href: '#features',
    },
    {
        label: 'FAQ',
        href: '#faq',
    },
    {
        label: 'Donate',
        href: '/donate',
    },
];

const Header = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

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
            className={cn('sticky top-0 z-50 w-full transition-all duration-300 ease-out', scrolled ? 'py-2' : 'py-4')}
        >
            <div
                className={cn(
                    'mx-auto transition-all duration-300 ease-out',
                    scrolled ? 'max-w-5xl px-4' : 'max-w-6xl px-6'
                )}
            >
                <div
                    className={cn(
                        'rounded-2xl border transition-all duration-300 ease-out',
                        scrolled
                            ? 'border-border bg-background/95 backdrop-blur-lg supports-backdrop-filter:bg-background/60 shadow-lg'
                            : 'border-transparent bg-transparent'
                    )}
                >
                    <nav className="flex h-16 items-center justify-between px-6">
                        {/* Logo */}
                        <a
                            className="flex items-center gap-2 cursor-pointer group"
                            onClick={() => {
                                if (location.pathname === '/' && !location.hash) {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                } else {
                                    navigate('/');
                                }
                            }}
                        >
                            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-sm">U</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                                urlinks
                            </span>
                        </a>

                        {/* Desktop Navigation */}
                        <div className="hidden items-center gap-8 md:flex">
                            {links.map((link, idx) => {
                                if (link.href.startsWith('#')) {
                                    return (
                                        <a
                                            key={idx}
                                            className={buttonVariants({
                                                variant: 'ghost',
                                                className: 'text-lg font-medium cursor-pointer',
                                            })}
                                            href={link.href}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (location.pathname === '/') {
                                                    const element = document.querySelector(link.href);
                                                    element?.scrollIntoView({ behavior: 'smooth' });
                                                } else {
                                                    navigate(`/${link.href}`);
                                                }
                                            }}
                                        >
                                            {link.label}
                                        </a>
                                    );
                                }

                                return (
                                    <Link
                                        className={buttonVariants({
                                            variant: 'ghost',
                                            className: 'text-lg font-medium',
                                        })}
                                        to={link.href}
                                        key={idx}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="hidden items-center gap-3 md:flex">
                            {isLoggedIn ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent transition-colors">
                                            {username && <span className="text-sm font-medium">{username}</span>}
                                            <Avatar className="size-8">
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
                                    <Button onClick={() => navigate('/login')} variant="ghost" className="font-medium">
                                        Sign In
                                    </Button>
                                    <Button onClick={() => navigate('/register')} className="font-medium">
                                        Get Started
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <Button className="md:hidden" onClick={() => setOpen(!open)} size="icon" variant="ghost">
                            {open ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
                        </Button>
                    </nav>
                </div>
            </div>

            {/* Mobile Menu */}
            <MobileMenu className="flex flex-col justify-between gap-2" open={open}>
                <div className="grid gap-y-2">
                    {links.map((link, idx) => {
                        if (link.href.startsWith('#')) {
                            return (
                                <a
                                    key={idx}
                                    className={buttonVariants({
                                        variant: 'ghost',
                                        className: 'text-lg cursor-pointer justify-start',
                                    })}
                                    href={link.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setOpen(false);
                                        if (location.pathname === '/') {
                                            const element = document.querySelector(link.href);
                                            element?.scrollIntoView({ behavior: 'smooth' });
                                        } else {
                                            navigate(`/${link.href}`);
                                        }
                                    }}
                                >
                                    {link.label}
                                </a>
                            );
                        }
                        return (
                            <Link
                                className={buttonVariants({
                                    variant: 'ghost',
                                    className: 'text-lg justify-start',
                                })}
                                to={link.href}
                                key={idx}
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
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
                'bg-background/95 backdrop-blur-xl supports-backdrop-filter:bg-background/60',
                'fixed top-[88px] right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-t md:hidden'
            )}
            id="mobile-menu"
        >
            <div
                className={cn(
                    'data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in',
                    'size-full p-6',
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
