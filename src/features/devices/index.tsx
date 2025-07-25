"use client";

import {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {DevicesTable} from "./devices-table";
import {DeviceFilters} from "./device-filters";
import {useDevices} from "./hooks";
import {PageContainer, BreadcrumbPage, BreadCrumbs, PageHeader, Actions} from "@/components/layout/page-container";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";

export default function DevicesPage() {
    const {fetchDevices, total, loading, error} = useDevices();
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

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
                    <BreadcrumbPage>Devices</BreadcrumbPage>
                </BreadCrumbs>
                <Actions>
                    <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="h-4 w-4 mr-2"/>
                        Add Device
                    </Button>
                </Actions>
            </PageHeader>

            <div className="space-y-6">

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{total}</div>
                            <p className="text-xs text-muted-foreground">
                                Registered devices
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
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
                            <CardTitle className="text-sm font-medium">POS Terminals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">-</div>
                            <p className="text-xs text-muted-foreground">
                                Point of sale devices
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">ATMs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">-</div>
                            <p className="text-xs text-muted-foreground">
                                Automated teller machines
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <DeviceFilters/>
                <DevicesTable showCreateDialog={showCreateDialog} setShowCreateDialog={setShowCreateDialog} />
            </div>
        </PageContainer>
    );
}