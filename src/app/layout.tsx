import { Geist, Geist_Mono } from "next/font/google";
import type {Metadata} from "next"
import {ThemeProvider} from "next-themes"
import React from "react"
import {siteConfig} from "@/app/siteConfig"
import {AppSidebar} from "@/components/layout/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import {ENV_VARIABLES} from "@/lib/constants";
import "@/app/styles/globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
    metadataBase: new URL(ENV_VARIABLES.APP_URL),
    title: siteConfig.name,
    description: siteConfig.description,
    authors: [
        {
            name: "blupay africa",
            url: "",
        },
    ],
    creator: "blupay africa",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        title: siteConfig.name,
        description: siteConfig.description,
        siteName: siteConfig.name,
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
        creator: "@blupayafrica",
    },
    icons: {
        icon: "/favicon.ico",
    },
}

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="h-full" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
        <ThemeProvider
            defaultTheme="light"
            disableTransitionOnChange
            attribute="class"
        >
            {children}
        </ThemeProvider>
        </body>
        </html>
    )
}
