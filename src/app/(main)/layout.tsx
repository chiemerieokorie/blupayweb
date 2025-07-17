import React from 'react';
import {AppSidebar} from "@/components/app-sidebar";
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar";

interface LayoutProps {
    children: React.ReactNode;
}


const Layout = (props: LayoutProps) => {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                {props.children}
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Layout;