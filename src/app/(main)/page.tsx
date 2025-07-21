import Dashboard from "@/features/dashboard";
import {BreadcrumbPage, BreadCrumbs, PageContainer, PageHeader} from "@/components/layout/page-container";
import {BreadcrumbLink} from "@/components/ui/breadcrumb";
import {SectionCards} from "@/components/section-cards";
import {ChartAreaInteractive} from "@/components/chart-area-interactive";
import {DataTable} from "@/components/data-table";
import data from "@/app/(main)/data.json";
import {ROUTES} from "@/lib/constants";

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
            <SectionCards/>
            <ChartAreaInteractive/>
            <DataTable data={data}/>
        </PageContainer>
    );
}
