"use client";

import {useEffect, useState} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CommissionsTable } from "./commissions-table";
import { useCommissions } from "./hooks";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react"
import {
  Actions,
  BreadcrumbPage,
  BreadCrumbs,
  PageContainer,
  PageHeader
} from '@/components/layout/page-container';
import {ROUTES} from "@/lib/constants";

export default function CommissionsPage() {
  const { fetchCommissions, total, loading, error, filters } = useCommissions();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions, filters]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <BreadCrumbs>
          <BreadcrumbPage>Commissions</BreadcrumbPage>
        </BreadCrumbs>
        <Actions>
          <Button onClick={() => setShowCreateDialog(true)}>
            <IconPlus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </Actions>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground">
              Commission rules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Commissions earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Across all rules
            </p>
          </CardContent>
        </Card>
      </div>
      <CommissionsTable setShowCreateDialog={setShowCreateDialog} showCreateDialog={showCreateDialog} />
    </PageContainer>
  );
}