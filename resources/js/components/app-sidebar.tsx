import { Link, usePage } from '@inertiajs/react';
import {
    FileCheck2,
    KeyRound,
    LayoutDashboard,
    Package,
    ScrollText,
    Settings2,
    ShieldCheck,
    SlidersHorizontal,
    UsersRound,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import * as admin from '@/routes/admin';
import * as generalSettings from '@/routes/admin/general-settings';
import * as documents from '@/routes/documents';
import * as jamaah from '@/routes/jamaah';
import * as logViewer from '@/routes/log-viewer';
import * as packages from '@/routes/packages';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutDashboard,
    },
    {
        title: 'Paket Umrah',
        href: packages.index(),
        icon: Package,
    },
    {
        title: 'Jamaah',
        href: jamaah.index(),
        icon: UsersRound,
    },
    {
        title: 'Dokumen',
        href: documents.index(),
        icon: FileCheck2,
    },
];

const adminNavItems: NavItem[] = [
    { title: 'Fasilitas', href: admin.facilities(), icon: Settings2 },
    { title: 'User', href: admin.users(), icon: UsersRound },
    { title: 'Role', href: admin.roles(), icon: ShieldCheck },
    { title: 'Permission', href: admin.permissions(), icon: KeyRound },
    {
        title: 'Pengaturan Umum',
        href: generalSettings.edit(),
        icon: SlidersHorizontal,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { auth } = usePage().props;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="h-24 group-data-[collapsible=icon]:h-8 hover:bg-transparent"
                            asChild
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {auth.can_admin && <NavMain items={adminNavItems} />}
                {auth.can_view_logs && (
                    <SidebarGroup className="px-2 py-0">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={{ children: 'Log Viewer' }}
                                >
                                    <a href={logViewer.index().url}>
                                        <ScrollText />
                                        <span>Log Viewer</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
