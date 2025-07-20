"use client"

import * as React from "react"
import {
    IconAffiliate,
    IconBuildingBank,
    IconCreditCardPay,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconHelp,
    IconInnerShadowTop,
    IconSquareRoundedPercentage,
    IconReport,
    IconSearch,
    IconSettings,
    IconUserCircle,
    IconUsers,
    IconDeviceTabletDollar,
} from "@tabler/icons-react"

import {NavGroup} from "@/components/layout/nav-group"
import {NavMain} from "@/components/layout/nav-main"
import {NavSecondary} from "@/components/layout/nav-secondary"
import {NavUser} from "@/components/layout/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {ROUTES} from "@/lib/constants";

const data = {
    user: {
        name: "Samson A",
        email: "s.akande@bluepenguin.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: ROUTES.DASHBOARD,
            icon: IconDashboard,
        },
        {
            title: "Transactions",
            url: ROUTES.TRANSACTIONS.INDEX,
            icon: IconCreditCardPay,
        },
        {
            title: "Commissions",
            url: ROUTES.COMMISSIONS.INDEX,
            icon: IconSquareRoundedPercentage,
        },
    ],
    management: [
        {
            name: "Merchants",
            url: ROUTES.MERCHANTS.INDEX,
            icon: IconAffiliate,
        },
        {
            name: "Users",
            url: ROUTES.USERS.INDEX,
            icon: IconUsers,
        },
        {
            name: "Partner Banks",
            url: ROUTES.PARTNER_BANKS.INDEX,
            icon: IconBuildingBank,
        },
    ],
    pos: [
        {
            name: "Terminals",
            url: ROUTES.DEVICES.INDEX,
            icon: IconDeviceTabletDollar,
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: IconSettings,
        },
        {
            title: "Get Help",
            url: "#",
            icon: IconHelp,
        },
        {
            title: "Search",
            url: "#",
            icon: IconSearch,
        },
    ],

}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="#">
                                <IconInnerShadowTop className="!size-5"/>
                                <span className="text-base font-semibold">
                  Blue Penguin
                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
                <NavGroup label={"Management"} items={data.management}/>
                <NavGroup label={"POS"} items={data.pos}/>
                <NavSecondary items={data.navSecondary} className="mt-auto"/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user}/>
            </SidebarFooter>
        </Sidebar>
    )
}
