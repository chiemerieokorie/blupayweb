import {BreadcrumbPage, BreadCrumbs, PageContainer, PageHeader} from "@/components/layout/page-container";
import {BreadcrumbLink} from "@/components/ui/breadcrumb";
import {ROUTES} from "@/lib/constants";

export default function UsersPage() {
  return (
    <PageContainer>
      <PageHeader>
        <BreadCrumbs>
          <BreadcrumbLink href={ROUTES.DASHBOARD}>Dashboard</BreadcrumbLink>
          <BreadcrumbPage>Users</BreadcrumbPage>
        </BreadCrumbs>
      </PageHeader>
    </PageContainer>
  );
}