'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { TransactionAnalytics } from '@/sdk/types';

interface TransactionChartProps {
  analytics: TransactionAnalytics;
  loading?: boolean;
  type?: 'line' | 'bar';
}

export function TransactionChart({ analytics, loading, type = 'line' }: TransactionChartProps) {
  if (loading) {
    return (
      <Card>
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

  const chartData = analytics.transactionsByDate.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    transactions: item.count,
    amount: item.amount,
  }));

  const Chart = type === 'line' ? LineChart : BarChart;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Trends</CardTitle>
        <CardDescription>
          Daily transaction volume and amounts over the selected period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <Chart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip 
              formatter={(value, name) => [
                name === 'amount' 
                  ? new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(Number(value))
                  : value,
                name === 'transactions' ? 'Transactions' : 'Amount'
              ]}
            />
            <Legend />
            {type === 'line' ? (
              <>
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="transactions"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name="Transactions"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="amount"
                  stroke="#dc2626"
                  strokeWidth={2}
                  name="Amount"
                />
              </>
            ) : (
              <>
                <Bar yAxisId="left" dataKey="transactions" fill="#2563eb" name="Transactions" />
                <Bar yAxisId="right" dataKey="amount" fill="#dc2626" name="Amount" />
              </>
            )}
          </Chart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}