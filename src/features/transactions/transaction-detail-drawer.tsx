'use client';

import { useEffect, useState } from 'react';
import { Copy, RefreshCw, Download, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { transactionsService } from '@/sdk/transactions';
import { Transaction } from '@/sdk/types';
import { useAtomValue } from 'jotai';
import { transactionsAtom } from './atoms';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface TransactionDetailDrawerProps {
  transactionRef: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailDrawer({ 
  transactionRef, 
  open, 
  onOpenChange 
}: TransactionDetailDrawerProps) {
  const { toast } = useToast();
  const transactionsState = useAtomValue(transactionsAtom);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRequerying, setIsRequerying] = useState(false);
  const [isReversing, setIsReversing] = useState(false);
  const [showReverseDialog, setShowReverseDialog] = useState(false);

  useEffect(() => {
    if (open && transactionRef) {
      // First try to find transaction in existing state
      const existingTransaction = transactionsState?.data?.find(
        t => t.transactionRef === transactionRef
      );
      
      if (existingTransaction) {
        setTransaction(existingTransaction);
        fetchTransactionStatus();
      } else {
        fetchTransaction();
      }
    }
  }, [open, transactionRef, transactionsState]);

  const fetchTransaction = async () => {
    if (!transactionRef) return;
    
    try {
      setLoading(true);
      const status = await transactionsService.getTransactionStatus(transactionRef);
      setTransactionStatus(status);
      
      // Create a transaction object from the limited status data
      const transactionData: Partial<Transaction> = {
        uuid: transactionRef,
        transactionRef: status.transactionReference || transactionRef,
        amount: status.amount,
        status: status.transactionStatus,
        processor: status.processor,
        customer: status.customer,
        currency: 'GHS',
        merchantId: status.merchantCode,
        description: status.statusMessage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        type: 'MONEY_IN',
        source: 'MOMO',
        surchargeOnCustomer: 0,
        surchargeOnMerchant: 0,
        processorResponse: {},
        elevyResponse: {},
      };
      
      setTransaction(transactionData as Transaction);
    } catch (err) {
      setError('Failed to load transaction details');
      toast({
        title: 'Error',
        description: 'Failed to load transaction details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactionStatus = async () => {
    if (!transactionRef) return;
    
    try {
      const status = await transactionsService.getTransactionStatus(transactionRef);
      setTransactionStatus(status);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load transaction status:', err);
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Copied to clipboard',
    });
  };

  const handleRequery = async () => {
    if (!transaction) return;
    
    try {
      setIsRequerying(true);
      await transactionsService.reQueryTransaction(transaction.transactionRef);
      toast({
        title: 'Re-query initiated',
        description: 'Transaction status re-query has been initiated',
      });
      // Refresh transaction data after a delay
      setTimeout(() => {
        if (transactionsState?.data?.find(t => t.transactionRef === transactionRef)) {
          fetchTransactionStatus();
        } else {
          fetchTransaction();
        }
      }, 3000);
    } catch (error) {
      toast({
        title: 'Re-query failed',
        description: 'Failed to re-query transaction status',
        variant: 'destructive',
      });
    } finally {
      setIsRequerying(false);
    }
  };

  const handleReverse = async () => {
    if (!transaction) return;
    
    try {
      setIsReversing(true);
      await transactionsService.reverseTransaction(transaction.transactionRef);
      toast({
        title: 'Reversal initiated',
        description: 'Transaction reversal has been initiated',
      });
      setShowReverseDialog(false);
      // Refresh transaction data after a delay
      setTimeout(() => {
        if (transactionsState?.data?.find(t => t.transactionRef === transactionRef)) {
          fetchTransactionStatus();
        } else {
          fetchTransaction();
        }
      }, 3000);
    } catch (error) {
      toast({
        title: 'Reversal failed',
        description: 'Failed to reverse transaction',
        variant: 'destructive',
      });
    } finally {
      setIsReversing(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!transaction) return;
    
    toast({
      title: 'Coming soon',
      description: 'Receipt download functionality will be available soon',
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'SUCCESSFUL':
        return 'default';
      case 'FAILED':
        return 'destructive';
      case 'PENDING':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatCurrency = (amount: number, currency = 'GHS') => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const getFailureReason = () => {
    if (transaction?.status !== 'FAILED') return null;
    
    // Check statusMessage from API
    if (transactionStatus?.statusMessage) {
      return transactionStatus.statusMessage;
    }
    
    // Check transaction description
    if (transaction.description) {
      return transaction.description;
    }
    
    // Check processor response for error messages
    if (transaction.processorResponse) {
      const response = transaction.processorResponse;
      
      // Common error fields in processor responses
      const errorFields = [
        'error', 'message', 'errorMessage', 'reason', 'description',
        'failureReason', 'responseMessage', 'statusDescription'
      ];
      
      for (const field of errorFields) {
        if (response[field]) {
          return response[field];
        }
      }
      
      // If response has error code, show it
      if (response.errorCode || response.responseCode) {
        return `Error Code: ${response.errorCode || response.responseCode}`;
      }
    }
    
    return 'Transaction failed - reason not specified';
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[600px] sm:w-[800px] overflow-y-auto" side="right">
          <SheetHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>Transaction Details</SheetTitle>
                <SheetDescription>
                  {transaction?.transactionRef || 'Loading...'}
                </SheetDescription>
              </div>
              <div className="flex items-center gap-2">
                {transaction?.status === 'PENDING' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRequery}
                    disabled={isRequerying}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRequerying ? 'animate-spin' : ''}`} />
                    Re-query
                  </Button>
                )}
                
                {transaction?.status === 'SUCCESSFUL' && transaction?.type === 'MONEY_IN' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReverseDialog(true)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reverse
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadReceipt}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Receipt
                </Button>
              </div>
            </div>
          </SheetHeader>

          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-48" />
              <Skeleton className="h-48" />
            </div>
          ) : error || !transaction ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{error || 'Transaction not found'}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Transaction Overview */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Transaction Overview</CardTitle>
                      <CardDescription>
                        ID: {transaction.uuid}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Amount</p>
                      <p className="text-xl font-bold">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Reference</p>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm">{transaction.transactionRef}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(transaction.transactionRef)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                      <p className="text-sm">{new Date(transaction.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Processor</p>
                      <Badge variant="secondary">{transaction.processor}</Badge>
                    </div>
                  </div>
                  
                  {/* Show failure reason if transaction failed */}
                  {transaction.status === 'FAILED' && (
                    <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <p className="text-sm font-medium text-destructive mb-1">Failure Reason</p>
                      <p className="text-sm text-destructive/80">
                        {getFailureReason()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Transaction Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Available Actions</CardTitle>
                  <CardDescription>Actions you can perform on this transaction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {transaction.status === 'PENDING' && (
                      <Button
                        variant="outline"
                        onClick={handleRequery}
                        disabled={isRequerying}
                        className="flex-1"
                      >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isRequerying ? 'animate-spin' : ''}`} />
                        {isRequerying ? 'Re-querying...' : 'Re-query Status'}
                      </Button>
                    )}
                    
                    {transaction.status === 'SUCCESSFUL' && transaction.type === 'MONEY_IN' && (
                      <Button
                        variant="outline"
                        onClick={() => setShowReverseDialog(true)}
                        className="flex-1"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reverse Transaction
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={handleDownloadReceipt}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(transaction.transactionRef)}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Reference
                    </Button>
                    
                    {transaction.status === 'FAILED' && (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          toast({
                            title: 'Dispute Transaction',
                            description: 'Contact support to dispute this failed transaction',
                          });
                        }}
                        className="flex-1"
                      >
                        Dispute Transaction
                      </Button>
                    )}
                  </div>
                  
                  {/* Action Status Messages */}
                  {transaction.status === 'PENDING' && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-xs text-yellow-800">
                        💡 This transaction is pending. You can re-query to check for status updates from the processor.
                      </p>
                    </div>
                  )}
                  
                  {transaction.status === 'SUCCESSFUL' && transaction.type === 'MONEY_IN' && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-xs text-green-800">
                        ✅ This transaction completed successfully. You can reverse it if needed.
                      </p>
                    </div>
                  )}
                  
                  {transaction.status === 'FAILED' && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-xs text-red-800">
                        ❌ This transaction failed. No further actions can be performed.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Name</p>
                      <p className="text-sm">{transaction.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                      <p className="text-sm">{transaction.customer.phoneNumber}</p>
                    </div>
                    {transaction.customer.email && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="text-sm">{transaction.customer.email}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Fees & Charges - Only show if we have surcharge data */}
              {(transaction.surchargeOnCustomer > 0 || transaction.surchargeOnMerchant > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Fees & Charges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Customer Surcharge</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(transaction.surchargeOnCustomer || 0, transaction.currency)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Merchant Surcharge</p>
                        <p className="text-lg font-semibold">
                          {formatCurrency(transaction.surchargeOnMerchant || 0, transaction.currency)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              {transaction.description && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{transaction.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Technical Details - Only show if we have response data */}
              {(transaction.processorResponse && Object.keys(transaction.processorResponse).length > 0) || 
               (transaction.elevyResponse && Object.keys(transaction.elevyResponse).length > 0) ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Technical Details</CardTitle>
                    <CardDescription>Response data from processors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {transaction.processorResponse && Object.keys(transaction.processorResponse).length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-muted-foreground">Processor Response</p>
                            {transaction.status === 'FAILED' && (
                              <Badge variant="destructive" className="text-xs">
                                Contains Error Details
                              </Badge>
                            )}
                          </div>
                          <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                            {JSON.stringify(transaction.processorResponse, null, 2)}
                          </pre>
                        </div>
                      )}
                      {transaction.elevyResponse && Object.keys(transaction.elevyResponse).length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Elevy Response</p>
                          <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                            {JSON.stringify(transaction.elevyResponse, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {/* Timestamps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Timestamps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Created At</p>
                      <p className="text-sm">{new Date(transaction.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                      <p className="text-sm">{new Date(transaction.updatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Reversal Confirmation Dialog */}
      <AlertDialog open={showReverseDialog} onOpenChange={setShowReverseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Transaction Reversal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reverse this transaction? This action cannot be undone.
              <br /><br />
              <strong>Transaction Details:</strong>
              <br />
              Reference: {transaction?.transactionRef}
              <br />
              Amount: {transaction ? formatCurrency(transaction.amount, transaction.currency) : ''}
              <br />
              Customer: {transaction?.customer.name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReverse}
              disabled={isReversing}
            >
              {isReversing ? 'Reversing...' : 'Confirm Reversal'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}