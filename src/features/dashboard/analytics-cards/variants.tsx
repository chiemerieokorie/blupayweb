import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {IconTrendingUp, IconTrendingDown, IconTrendingUp2} from "@tabler/icons-react";
import clsx from "clsx";



type Trend = "up" | "down" | "neutral"

export interface SectionCardItem {
    label: string
    value: string
    delta?: number
    trend?: Trend
    footerPrimary: string
    footerSecondary: string
}

interface SectionCardsProps {
    items: SectionCardItem[]
    className?: string
}

const trendIconMap: Record<Trend, typeof IconTrendingUp> = {
    up: IconTrendingUp,
    down: IconTrendingDown,
    neutral: IconTrendingUp2,
}

export function Cards({ items, className }: SectionCardsProps) {
    return (
        <div
            className={clsx(
                "[grid-template-columns:repeat(auto-fit,minmax(16rem,1fr))]",
                "grid gap-4",
                "*:data-[slot=card]:bg-gradient-to-t",
                "*:data-[slot=card]:from-primary/5",
                "*:data-[slot=card]:to-card",
                "*:data-[slot=card]:shadow-xs",
                "dark:*:data-[slot=card]:bg-card",
                className,
            )}
        >
            {items.map(
                (
                    { label, value, delta = 0, trend = "neutral", footerPrimary, footerSecondary },
                    idx,
                ) => {
                    const Icon = trendIconMap[trend]
                    const deltaFormatted =
                        delta === 0
                            ? "0%"
                            : `${trend === "down" ? "-" : "+"}${Math.abs(delta).toFixed(1)}%`

                    return (
                        <Card key={idx} className="@container/card">
                            <CardHeader>
                                <CardDescription>{label}</CardDescription>
                                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                    {value}
                                </CardTitle>
                                <CardAction>
                                    <Badge variant="outline">
                                        <Icon className="mr-1.5" />
                                        {deltaFormatted}
                                    </Badge>
                                </CardAction>
                            </CardHeader>
                            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                                <div className="line-clamp-1 flex gap-2 font-medium">
                                    {footerPrimary} <Icon className="size-4" />
                                </div>
                                <div className="text-muted-foreground">{footerSecondary}</div>
                            </CardFooter>
                        </Card>
                    )
                },
            )}
        </div>
    )
}



export const AnalyticsCardsLoading = () => {
    return (
        <div className="flex gap-4">
            {
                Array.from({ length: 4 }).map(() => (<Skeleton key={Math.random()} className="h-24 w-full rounded-md" />
                ))}

        </div>
    );
};

export const AnalyticsCardsError = () => {
    return (
        <div className="flex gap-4">
            <p className="text-destructive">
                We encountered an error while loading the analytics cards. Please try again later.
            </p>
            {
                Array.from({ length: 4 }).map(() => (
                    <div key={Math.random()} className="h-24 w-full rounded-md flex items-center justify-center"/>

                ))}

        </div>
    );

}