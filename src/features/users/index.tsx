"use client";

import {useEffect, useState} from "react";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {FeatureErrorBoundary} from "@/components/error-boundary";
import {UsersTable} from "./users-table";
import {UserFilters} from "./user-filters";
import {useUsers} from "./hooks";
import {PageContainer, PageHeader, BreadCrumbs, BreadcrumbPage, Actions} from "@/components/layout/page-container";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";

export default function UsersPage() {
    const {fetchUsers, error} = useUsers();
    const [showCreateDialog, setShowCreateDialog] = useState(false);


    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    if (error) {
        return (
            <PageContainer>
                <PageHeader>
                    <BreadCrumbs>
                        <BreadcrumbPage>Users</BreadcrumbPage>
                    </BreadCrumbs>
                </PageHeader>

                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </PageContainer>
        );
    }

    return (
        <FeatureErrorBoundary featureName="Users Management">
            <PageContainer>
                <PageHeader>
                    <BreadCrumbs>
                        <BreadcrumbPage>Users</BreadcrumbPage>
                    </BreadCrumbs>
                    <Actions>
                        <Button onClick={() => setShowCreateDialog(true)}>
                            <Plus className="h-4 w-4 mr-2"/>
                            Add User
                        </Button>
                    </Actions>
                </PageHeader>

                <div className="space-y-4">
                    <FeatureErrorBoundary featureName="User Table">
                        <UserFilters/>
                        <UsersTable showCreateDialog={showCreateDialog} setShowCreateDialog={setShowCreateDialog}/>
                    </FeatureErrorBoundary>
                </div>
            </PageContainer>
        </FeatureErrorBoundary>
    );
}