import Dashboard from "@/features/dashboard";
import {BreadcrumbPage, BreadCrumbs, PageContainer, PageHeader} from "@/components/layout/page-container";
import {BreadcrumbLink} from "@/components/ui/breadcrumb";
import {ChartAreaInteractive} from "@/components/chart-area-interactive";
import {DataTable} from "@/components/data-table";
import data from "@/app/(main)/data.json";
import {ROUTES} from "@/lib/constants";
import {AnalyticsCards} from "@/features/dashboard/analytics-cards";

export default function Home() {
    return (
        <PageContainer>
            <PageHeader>
                <BreadCrumbs>
                    <BreadcrumbLink href={ROUTES.DASHBOARD}>Dashboard</BreadcrumbLink>
                    <BreadcrumbPage>Transaction Report</BreadcrumbPage>
                </BreadCrumbs>
            </PageHeader>

            {/*<Dashboard />*/}
            <AnalyticsCards/>
            <ChartAreaInteractive/>
            <DataTable data={data}/>
        </PageContainer>
    );
}
