import {AppSidebar} from "@/components/app-sidebar"
import {ChartAreaInteractive} from "@/components/chart-area-interactive"
import {DataTable} from "@/components/data-table"
import {SectionCards} from "@/components/section-cards"
import {
    SidebarInset,
    SidebarProvider
} from "@/components/ui/sidebar"

import {PageContainer, PageHeader, BreadCrumbs, BreadcrumbLink} from "@/components/page-container"


import data from "./data.json"

export default function Page() {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset"/>
            <SidebarInset>
                <PageContainer>
                    <PageHeader>
                        <BreadCrumbs>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                            <BreadcrumbLink href="/dashboard/analytics">Analytics</BreadcrumbLink>
                        </BreadCrumbs>
                    </PageHeader>

                    <SectionCards/>
                    <div className="px-4 lg:px-6">
                        <ChartAreaInteractive/>
                    </div>
                    <DataTable data={data}/>
                </PageContainer>
            </SidebarInset>
        </SidebarProvider>
    )
}
