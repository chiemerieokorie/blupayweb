'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { Transaction, TransactionStatus, TransactionType } from '@/sdk/types';
import Link from 'next/link';

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading?: boolean;
}

export function RecentTransactions({ transactions, loading }: RecentTransactionsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (status: TransactionStatus) => {
    const variants = {
      SUCCESSFUL: 'default',
      PENDING: 'secondary',
      FAILED: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.toLowerCase()}
      </Badge>
    );
  };

  const getTransactionIcon = (type: TransactionType) => {
    return type === 'MONEY_IN' ? (
      <ArrowDownRight className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowUpRight className="h-4 w-4 text-red-500" />
    );
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest transaction activity
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/transactions">
            View All
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.uuid} className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {getTransactionIcon(transaction.type)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium truncate">
                      {transaction.customer.name}
                    </p>
                    {getStatusBadge(transaction.status)}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{transaction.processor}</span>
                    <span>•</span>
                    <span>{transaction.transactionRef}</span>
                    <span>•</span>
                    <span>
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    transaction.type === 'MONEY_IN' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'MONEY_IN' ? '+' : '-'}
                    {formatAmount(transaction.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.source}
                  </p>
                </div>
                
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}