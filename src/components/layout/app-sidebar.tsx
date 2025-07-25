"use client"

import * as React from "react"
import {
    IconAffiliate,
    IconBuildingBank,
    IconCreditCardPay,
    IconDashboard,
    IconHelp,
    IconInnerShadowTop,
    IconSquareRoundedPercentage,
    IconSettings,
    IconUsers,
    IconDeviceTabletDollar,
    IconMoneybag,
    IconWorldWww,
    IconTransfer,
    IconFileText,
    IconPigMoney,
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
import {ROUTES} from "@/lib/constants"
import { useAuth } from "@/features/auth/hooks";
import {UserRoleEnum} from "@/sdk";

const getNavigationData = (user: { firstName: string; lastName: string; email: string; role: string } | null) => {
    const baseNavMain = [
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
    ];

    const adminManagement = [
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
        // {
        //     name: "Devices",
        //     url: ROUTES.DEVICES.INDEX,
        //     icon: IconDeviceTabletDollar,
        // },
        // {
        //     name: "Settlements",
        //     url: ROUTES.SETTLEMENTS.INDEX,
        //     icon: IconPigMoney,
        // },
        // {
        //     name: "Telcos",
        //     url: ROUTES.TELCOS.INDEX,
        //     icon: IconWorldWww,
        // },
        // {
        //     name: "Cashout",
        //     url: ROUTES.CASHOUT.INDEX,
        //     icon: IconMoneybag,
        // },
        // {
        //     name: "Remittance",
        //     url: ROUTES.REMITTANCE.INDEX,
        //     icon: IconTransfer,
        // },
        // {
        //     name: "SP Transfers",
        //     url: ROUTES.SP_TRANSFERS.INDEX,
        //     icon: IconFileText,
        // },
        // {
        //     name: "Sub-Merchants",
        //     url: ROUTES.SUB_MERCHANTS.INDEX,
        //     icon: IconAffiliate,
        // },
        // {
        //     name: "API Keys",
        //     url: ROUTES.API_KEYS.INDEX,
        //     icon: IconSettings,
        // },
    ];

    const merchantManagement = [
        {
            name: "Sub-Merchants",
            url: ROUTES.SUB_MERCHANTS.INDEX,
            icon: IconAffiliate,
        },
        {
            name: "API Keys",
            url: ROUTES.API_KEYS.INDEX,
            icon: IconSettings,
        },
    ];

    const partnerBankManagement = [
        {
            name: "Merchants",
            url: ROUTES.MERCHANTS.INDEX,
            icon: IconAffiliate,
        },
        {
            name: "Devices",
            url: ROUTES.DEVICES.INDEX,
            icon: IconDeviceTabletDollar,
        },
        {
            name: "Settlements",
            url: ROUTES.SETTLEMENTS.INDEX,
            icon: IconPigMoney,
        },
    ];

    const pos = [
        {
            name: "Terminals",
            url: ROUTES.DEVICES.INDEX,
            icon: IconDeviceTabletDollar,
        },
    ];

    const navSecondary = [
        {
            title: "Settings",
            url: ROUTES.SETTINGS.INDEX,
            icon: IconSettings,
        },
        {
            title: "Get Help",
            url: ROUTES.HELP,
            icon: IconHelp,
            allowedRoles: ['ADMIN', 'MERCHANT', 'PARTNER_BANK'],
        },
    ];

    // Role-based navigation
    let management: typeof adminManagement | typeof merchantManagement | typeof partnerBankManagement= [];
    if (user?.role === UserRoleEnum.ADMIN) {
        management = adminManagement;
    } else if (user?.role === UserRoleEnum.MERCHANT) {
        management = merchantManagement;
    } else if (user?.role === UserRoleEnum.PARTNER_BANK) {
        management = partnerBankManagement;
    }

    return {
        user: {
            name: user ? `${user.firstName} ${user.lastName}` : "Guest",
            email: user?.email || "",
            avatar: "/avatars/default.jpg",
        },
        navMain: baseNavMain,
        management,
        merchantManagement: user?.role === UserRoleEnum.ADMIN || user?.role === UserRoleEnum.PARTNER_BANK ? merchantManagement : [],
        pos: user?.role === UserRoleEnum.ADMIN || user?.role === UserRoleEnum.PARTNER_BANK ? pos : [],
        navSecondary,
    };
};

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const { user } = useAuth();
    const data = getNavigationData(user);

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <IconInnerShadowTop className="!size-5"/>
                            <span className="text-base font-semibold">
                              Blupay Africa
                            </span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
                {data.management.length > 0 && <NavGroup label={"Management"} items={data.management}/>}
                {data.pos.length > 0 && <NavGroup label={"POS"} items={data.pos}/>}
                <NavSecondary items={data.navSecondary} className="mt-auto"/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user}/>
            </SidebarFooter>
        </Sidebar>
    )
}
