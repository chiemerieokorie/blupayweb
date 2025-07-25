"use client";

import {useEffect, useState} from "react";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {PartnerBanksTable} from "./partner-banks-table";
import {PartnerBankFilters} from "./partner-bank-filters";
import {usePartnerBanks} from "./hooks";
import {PageContainer, PageHeader, BreadCrumbs, BreadcrumbPage, Actions} from '@/components/layout/page-container';
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";

export default function PartnerBanksPage() {
    const {fetchPartnerBanks, total, loading, error} = usePartnerBanks();
    const [showCreateDialog, setShowCreateDialog] = useState(false);

    useEffect(() => {
        fetchPartnerBanks();
    }, [fetchPartnerBanks]);

    if (error) {
        return (
            <PageContainer>
                <PageHeader>
                    <BreadCrumbs>
                        <BreadcrumbPage>Partner Banks</BreadcrumbPage>
                    </BreadCrumbs>
                </PageHeader>

                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader>
                <BreadCrumbs>
                    <BreadcrumbPage>Partner Banks</BreadcrumbPage>
                </BreadCrumbs>
                <Actions>
                    <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="h-4 w-4 mr-2"/>
                        Add Partner Bank
                    </Button>
                </Actions>
            </PageHeader>

            <div className="space-y-4">
                <PartnerBankFilters/>
                <PartnerBanksTable setShowCreateDialog={setShowCreateDialog} showCreateDialog={showCreateDialog}/>
            </div>
        </PageContainer>
    );
}