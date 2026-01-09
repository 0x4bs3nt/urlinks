import * as React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';

import {
    LayersIcon,
    PanelLeftIcon,
    MoreVerticalIcon,
    UserCircleIcon,
    CreditCardIcon,
    BellIcon,
    LogOutIcon,
    Github,
    HeartIcon,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/auth';

const navMain = [
    {
        title: 'Profile',
        url: '/dashboard',
    },
    {
        title: 'Links',
        url: '/dashboard/links',
    },
    {
        title: 'Analytics',
        url: '/dashboard/analytics',
    },
];

export default function DashboardLayout() {
    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <Outlet />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-1.5">
                    <LayersIcon className="size-5 text-sidebar-foreground" />
                    <span className="text-base font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                        freetree
                    </span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
    }[];
}) {
    const location = useLocation();

    const isActiveRoute = (url: string) => {
        if (url === '/dashboard') {
            return location.pathname === '/dashboard';
        }

        return location.pathname.startsWith(url);
    };

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {items.map((item) => {
                        const isActive = isActiveRoute(item.url);

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    asChild
                                    data-active={isActive}
                                    className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                                >
                                    <NavLink to={item.url}>
                                        <PanelLeftIcon />
                                        <span>{item.title}</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

function NavUser() {
    const authStore = useAuthStore();
    const username = authStore.username;
    const email = authStore.email;

    const logout = authStore.logout;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    //src={user.avatar}
                                    alt={username || 'User Avatar'}
                                />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{username}</span>
                                <span className="text-muted-foreground truncate text-xs">{email}</span>
                            </div>
                            <MoreVerticalIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side="right"
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        // src={user.avatar}
                                        alt={username || 'User Avatar'}
                                    />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{username}</span>
                                    <span className="text-muted-foreground truncate text-xs">{email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <UserCircleIcon />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <CreditCardIcon />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <BellIcon />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout}>
                            <LogOutIcon />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

function SiteHeader() {
    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <div className="ml-auto flex items-center gap-2">
                    <NavLink
                        to="/donate"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        <HeartIcon className="size-4" />
                        <span>Donate</span>
                    </NavLink>
                    <a
                        href="https://github.com/0x4bs3nt/freetree"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        <Github className="size-4" />
                        <span>GitHub</span>
                    </a>
                </div>
            </div>
        </header>
    );
}
