import {BreadcrumbPage, BreadCrumbs, PageContainer, PageHeader} from "@/components/layout/page-container";
import {BreadcrumbLink} from "@/components/ui/breadcrumb";
import {ROUTES} from "@/lib/constants";

export default function MerchantsPage() {
  return (
    <PageContainer>
      <PageHeader>
        <BreadCrumbs>
          <BreadcrumbLink href={ROUTES.DASHBOARD}>Dashboard</BreadcrumbLink>
          <BreadcrumbPage>Merchants</BreadcrumbPage>
        </BreadCrumbs>
      </PageHeader>
    </PageContainer>
  );
}