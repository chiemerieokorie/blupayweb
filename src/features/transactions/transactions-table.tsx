'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Eye, 
  RefreshCw, 
  Undo2, 
  ChevronLeft, 
  ChevronRight,
  Download
} from 'lucide-react';
import { Transaction, TransactionStatus } from '@/sdk/types';
import { useTransaction } from './hooks';

interface TransactionsTableProps {
  transactions: Transaction[];
  loading?: boolean;
  pagination?: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
  onViewTransaction?: (transaction: Transaction) => void;
}

export function TransactionsTable({
  transactions,
  loading,
  pagination,
  onPageChange,
  onViewTransaction,
}: TransactionsTableProps) {
  const { reQuery, reverse } = useTransaction();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const getStatusBadge = (status: TransactionStatus) => {
    const variants = {
      SUCCESSFUL: { variant: 'default' as const, label: 'Successful' },
      PENDING: { variant: 'secondary' as const, label: 'Pending' },
      FAILED: { variant: 'destructive' as const, label: 'Failed' },
    };

    const config = variants[status];
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReQuery = async (transactionRef: string) => {
    try {
      setActionLoading(transactionRef);
      await reQuery(transactionRef);
    } catch (error) {
      console.error('Re-query failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReverse = async (transactionRef: string) => {
    try {
      setActionLoading(transactionRef);
      await reverse(transactionRef);
    } catch (error) {
      console.error('Reverse failed:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transactions</CardTitle>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Processor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.uuid}>
                      <TableCell className="font-mono text-sm">
                        {transaction.transactionRef}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.customer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.customer.phoneNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {formatAmount(transaction.amount)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.source}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.processor}</Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(transaction.status)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(transaction.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              disabled={actionLoading === transaction.transactionRef}
                            >
                              {actionLoading === transaction.transactionRef ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => onViewTransaction?.(transaction)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleReQuery(transaction.transactionRef)}
                              disabled={transaction.status === 'SUCCESSFUL'}
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Re-query
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleReverse(transaction.transactionRef)}
                              disabled={transaction.status !== 'SUCCESSFUL'}
                            >
                              <Undo2 className="mr-2 h-4 w-4" />
                              Reverse
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((pagination.page - 1) * pagination.perPage) + 1} to{' '}
                  {Math.min(pagination.page * pagination.perPage, pagination.total)} of{' '}
                  {pagination.total} transactions
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange?.(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <div className="text-sm">
                    Page {pagination.page} of {pagination.totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange?.(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}