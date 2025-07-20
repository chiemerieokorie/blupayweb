import React from 'react';
import {SiteHeader} from "@/components/site-header";

interface PageWrapperProps {
    className?: string;
    children?: React.ReactNode;
}

export const PageContainer = (props: PageWrapperProps) => {
    return (
        <>
            <SiteHeader/>
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        {props.children}
                    </div>
                </div>
            </div>

        </>
    );
};