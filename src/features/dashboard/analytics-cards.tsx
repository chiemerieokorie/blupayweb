'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import { TransactionAnalytics } from '@/sdk/types';

interface AnalyticsCardsProps {
  analytics: TransactionAnalytics;
  loading?: boolean;
}

export function AnalyticsCards({ analytics, loading }: AnalyticsCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const successRate = analytics.totalTransactions > 0 
    ? (analytics.successfulTransactions / analytics.totalTransactions) * 100 
    : 0;

  const cards = [
    {
      title: 'Total Amount',
      value: new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
      }).format(analytics.totalAmount),
      description: `${analytics.totalTransactions} transactions`,
      icon: DollarSign,
      trend: analytics.totalAmount > 0 ? 'up' : 'neutral',
    },
    {
      title: 'Successful',
      value: analytics.successfulTransactions.toLocaleString(),
      description: `${successRate.toFixed(1)}% success rate`,
      icon: CheckCircle,
      trend: successRate >= 95 ? 'up' : successRate >= 85 ? 'neutral' : 'down',
      color: 'text-green-600',
    },
    {
      title: 'Failed',
      value: analytics.failedTransactions.toLocaleString(),
      description: `${analytics.failedTransactions > 0 ? ((analytics.failedTransactions / analytics.totalTransactions) * 100).toFixed(1) : 0}% failure rate`,
      icon: XCircle,
      trend: analytics.failedTransactions === 0 ? 'up' : 'down',
      color: 'text-red-600',
    },
    {
      title: 'Pending',
      value: analytics.pendingTransactions.toLocaleString(),
      description: 'Awaiting confirmation',
      icon: Clock,
      trend: 'neutral',
      color: 'text-yellow-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${card.color || 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color || ''}`}>
                {card.value}
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {card.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                {card.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                {card.trend === 'neutral' && <Activity className="h-3 w-3 text-gray-500" />}
                <span>{card.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}