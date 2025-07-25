"use client";

import {useEffect} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {FeatureErrorBoundary} from "@/components/error-boundary";
import {UsersTable} from "./users-table";
import {UserFilters} from "./user-filters";
import {useUsers} from "./hooks";
import {PageContainer, PageHeader, BreadCrumbs, BreadcrumbPage} from "@/components/layout/page-container";

export default function UsersPage() {
    const {fetchUsers, total, error} = useUsers();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (

        <FeatureErrorBoundary featureName="Users Management">
            <PageContainer>
                <PageHeader>
                    <BreadCrumbs>
                        <BreadcrumbPage>Users Management</BreadcrumbPage>
                    </BreadCrumbs>
                </PageHeader>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{total}</div>
                                <p className="text-xs text-muted-foreground">
                                    Active user accounts
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Admins</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">-</div>
                                <p className="text-xs text-muted-foreground">
                                    Administrator accounts
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Merchants</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">-</div>
                                <p className="text-xs text-muted-foreground">
                                    Merchant accounts
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Partner Banks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">-</div>
                                <p className="text-xs text-muted-foreground">
                                    Partner bank accounts
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                            <CardDescription>
                                A list of all users in the system with their details and roles.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <FeatureErrorBoundary featureName="User Filters">
                                    <UserFilters/>
                                </FeatureErrorBoundary>
                                <FeatureErrorBoundary featureName="Users Table">
                                    <UsersTable/>
                                </FeatureErrorBoundary>
                            </div>
                        </CardContent>
                    </Card>
            </PageContainer>
        </FeatureErrorBoundary>

    );
}