'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMerchantsPage } from './hooks';
import { MerchantsTable } from './merchants-table';
import { CreateMerchantForm } from './create-merchant-form';
import { Merchant } from '@/sdk/types';

export function MerchantsPage() {
  const { merchants, loading, error, filters, updateFilters, refetch } = useMerchantsPage();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePageChange = async (page: number) => {
    await updateFilters({ page });
  };

  const handleSearch = async (search: string) => {
    setSearchTerm(search);
    await updateFilters({ search, page: 1 });
  };

  const handleViewMerchant = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
  };

  const handleEditMerchant = (merchant: Merchant) => {
    // TODO: Implement edit functionality
    console.log('Edit merchant:', merchant);
  };

  const handleViewSubMerchants = (merchant: Merchant) => {
    // TODO: Implement sub-merchants view
    console.log('View sub-merchants for:', merchant);
  };

  const handleManageApiKeys = (merchant: Merchant) => {
    // TODO: Implement API keys management
    console.log('Manage API keys for:', merchant);
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
            <h1 className="text-3xl font-bold tracking-tight">Merchants</h1>
            <p className="text-muted-foreground">Manage merchant accounts and settings</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Merchants</h1>
          <p className="text-muted-foreground">
            Manage merchant accounts and settings
          </p>
        </div>
        
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Merchant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Merchant</DialogTitle>
            </DialogHeader>
            <CreateMerchantForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search merchants by name, email, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => handleSearch(searchTerm)}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Merchants Table */}
      <MerchantsTable
        merchants={merchants?.data || []}
        loading={loading}
        pagination={merchants ? {
          page: filters.page || 1,
          perPage: filters.perPage || 10,
          total: merchants.total || 0,
          totalPages: Math.ceil((merchants.total || 0) / (filters.perPage || 10))
        } : undefined}
        onPageChange={handlePageChange}
        onViewMerchant={handleViewMerchant}
        onEditMerchant={handleEditMerchant}
        onViewSubMerchants={handleViewSubMerchants}
        onManageApiKeys={handleManageApiKeys}
      />

      {/* Merchant Details Dialog */}
      <Dialog 
        open={!!selectedMerchant} 
        onOpenChange={(open) => !open && setSelectedMerchant(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Merchant Details</DialogTitle>
          </DialogHeader>
          {selectedMerchant && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-4">Basic Information</h4>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{selectedMerchant.merchantName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Code:</span>
                      <span className="font-mono">{selectedMerchant.merchantCode}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{selectedMerchant.merchantCategoryCode}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Country:</span>
                      <span>{selectedMerchant.country}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{selectedMerchant.notificationEmail}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Services</h4>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Mobile Money:</span>
                      <span>{selectedMerchant.canProcessMomoTransactions ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Card Payments:</span>
                      <span>{selectedMerchant.canProcessCardTransactions ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Partner Bank:</span>
                      <span>{selectedMerchant.partnerBankId}</span>
                    </div>
                    {selectedMerchant.webhookUrl && (
                      <div className="grid grid-cols-2 gap-2">
                        <span className="text-muted-foreground">Webhook:</span>
                        <span className="font-mono text-xs break-all">{selectedMerchant.webhookUrl}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-4">Settlement Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Bank:</span>
                      <span>{selectedMerchant.settlementDetails.bankName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Account:</span>
                      <span className="font-mono">{selectedMerchant.settlementDetails.accountNumber}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{selectedMerchant.settlementDetails.accountName}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Bank Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Bank:</span>
                      <span>{selectedMerchant.bankDetails.bankName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Account:</span>
                      <span className="font-mono">{selectedMerchant.bankDetails.accountNumber}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{selectedMerchant.bankDetails.accountName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedMerchant.apiKey && (
                <div>
                  <h4 className="font-medium mb-4">API Integration</h4>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Public Key:</span>
                      <span className="font-mono text-xs break-all">{selectedMerchant.apiKey.publicKey}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Status:</span>
                      <span>{selectedMerchant.apiKey.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MerchantsPage;