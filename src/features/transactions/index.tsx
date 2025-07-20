'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTransactionsPage } from './hooks';
import { TransactionFilters } from './transaction-filters';
import { TransactionsTable } from './transactions-table';
import { CreateTransactionForm } from './create-transaction-form';
import { Transaction } from '@/sdk/types';

export function TransactionsPage() {
  const { transactions, loading, error, updateFilters, refetch } = useTransactionsPage();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handlePageChange = async (page: number) => {
    await updateFilters({ page });
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    refetch();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">Manage and monitor all transactions</p>
          </div>
        </div>
        
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage and monitor all transactions
          </p>
        </div>
        
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Transaction</DialogTitle>
            </DialogHeader>
            <CreateTransactionForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <TransactionFilters />
        </div>
        
        <div className="lg:col-span-3">
          <TransactionsTable
            transactions={transactions?.data || []}
            loading={loading}
            pagination={transactions?.meta}
            onPageChange={handlePageChange}
            onViewTransaction={handleViewTransaction}
          />
        </div>
      </div>

      {/* Transaction Details Dialog */}
      <Dialog 
        open={!!selectedTransaction} 
        onOpenChange={(open) => !open && setSelectedTransaction(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Transaction Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Reference:</span>
                      <span className="font-mono">{selectedTransaction.transactionRef}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('en-GH', {
                          style: 'currency',
                          currency: 'GHS',
                        }).format(selectedTransaction.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span>{selectedTransaction.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processor:</span>
                      <span>{selectedTransaction.processor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span>{selectedTransaction.type}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Name:</span>
                      <span>{selectedTransaction.customer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span>{selectedTransaction.customer.phoneNumber}</span>
                    </div>
                    {selectedTransaction.customer.email && (
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span>{selectedTransaction.customer.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedTransaction.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedTransaction.description}
                  </p>
                </div>
              )}
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Created: {new Date(selectedTransaction.createdAt).toLocaleString()}</span>
                <span>Updated: {new Date(selectedTransaction.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TransactionsPage;