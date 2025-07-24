'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useIsMobile } from '@/hooks/use-mobile';
import { TransactionAnalytics } from '@/sdk/types';
import {useDashboard} from "@/features/dashboard/hooks";

interface TransactionChartProps {
  analytics: TransactionAnalytics;
  loading?: boolean;
}

const chartConfig = {
  transactions: {
    label: 'Transactions',
    color: 'var(--primary)',
  },
  amount: {
    label: 'Amount (GHS)',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

export function TransactionChart() {
  const {
    analytics,
    loading
  } = useDashboard();

  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState('30d');
  const [viewMode, setViewMode] = React.useState<'transactions' | 'amount'>('transactions');

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  if (loading || !analytics) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  // Check if transactionsByDate exists and has data
  if (!analytics.transactionsByDate || !Array.isArray(analytics.transactionsByDate) || analytics.transactionsByDate.length === 0) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Transaction Trends</CardTitle>
          <CardDescription>No transaction data available for the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80 text-muted-foreground">
            <div className="text-center">
              <p>No chart data available</p>
              <p className="text-sm mt-2">Try adjusting the date range or check if there are transactions in the system</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const allData = analytics.transactionsByDate.map((item) => ({
    date: item.date,
    displayDate: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    transactions: item.count,
    amount: item.amount,
  }));

  // Filter data based on time range
  const filteredData = allData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 30;
    if (timeRange === '90d') {
      daysToSubtract = 90;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const chartData = filteredData.map(item => ({
    ...item,
    displayDate: item.displayDate
  }));

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Transaction Trends</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {viewMode === 'transactions' ? 'Daily transaction volume' : 'Daily transaction amounts'} for the selected period
          </span>
          <span className="@[540px]/card:hidden">
            {viewMode === 'transactions' ? 'Transaction volume' : 'Transaction amounts'}
          </span>
        </CardDescription>
        <CardAction>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(value) => value && setViewMode(value as 'transactions' | 'amount')}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-3 @[520px]/card:flex"
            >
              <ToggleGroupItem value="transactions">Count</ToggleGroupItem>
              <ToggleGroupItem value="amount">Amount</ToggleGroupItem>
            </ToggleGroup>

            {/* Time Range Toggle */}
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-3 @[767px]/card:flex"
            >
              <ToggleGroupItem value="7d">7d</ToggleGroupItem>
              <ToggleGroupItem value="30d">30d</ToggleGroupItem>
              <ToggleGroupItem value="90d">90d</ToggleGroupItem>
            </ToggleGroup>

            {/* Mobile Select */}
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="flex w-32 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select time range"
              >
                <SelectValue placeholder="30d" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="7d" className="rounded-lg">
                  Last 7 days
                </SelectItem>
                <SelectItem value="30d" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="90d" className="rounded-lg">
                  Last 90 days
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillTransactions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-transactions)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-transactions)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-amount)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-amount)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="displayDate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : Math.floor(chartData.length / 2)}
              content={
                <ChartTooltipContent
                  labelFormatter={(value, payload) => {
                    if (payload && payload[0]) {
                      const originalDate = payload[0].payload.date;
                      return new Date(originalDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });
                    }
                    return value;
                  }}
                  formatter={(value, name) => [
                    name === 'amount' 
                      ? new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(Number(value))
                      : value,
                    name === 'transactions' ? 'Transactions' : 'Amount (GHS)'
                  ]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey={viewMode}
              type="natural"
              fill={viewMode === 'transactions' ? "url(#fillTransactions)" : "url(#fillAmount)"}
              stroke={viewMode === 'transactions' ? "var(--color-transactions)" : "var(--color-amount)"}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}