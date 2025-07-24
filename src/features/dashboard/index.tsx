'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Calendar } from 'lucide-react';
import { useDashboard } from './hooks';
import { AnalyticsCards } from './analytics-cards';
import { TransactionChart } from './transaction-chart';
import { RecentTransactions } from './recent-transactions';
import { WalletBalanceCard } from './wallet-balance';

export function Dashboard() {
  const {
    analytics,
    balance,
    transactions,
    loading,
    error,
    refresh,
    roleSpecificMetrics,
    user,
  } = useDashboard();

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.firstName}
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={refresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {(roleSpecificMetrics as any)?.title || 'Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}
            {user?.role && (
              <Badge variant="secondary" className="ml-2">
                {user.role.replace('_', ' ')}
              </Badge>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <AnalyticsCards />
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Wallet Balance - Show for Merchants and Sub-Merchants */}
        {(roleSpecificMetrics as any)?.showWalletBalance && (
          <WalletBalanceCard 
            balance={balance} 
            loading={loading}
            onRefresh={refresh}
          />
        )}

        {/* Transaction Chart */}
        <div className="md:col-span-2">
          {analytics && (
            <TransactionChart analytics={analytics} loading={loading} />
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={transactions} loading={loading} />

      {/* Role-specific sections */}
      {user?.role === 'ADMIN' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Overall system status and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>API Status</span>
                  <Badge variant="default">Online</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Active Merchants</span>
                  <span className="font-medium">--</span>
                </div>
                <div className="flex justify-between">
                  <span>Partner Banks</span>
                  <span className="font-medium">--</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Button variant="outline" size="sm">Create Merchant</Button>
                <Button variant="outline" size="sm">Add Partner Bank</Button>
                <Button variant="outline" size="sm">System Settings</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {user?.role === 'MERCHANT' && (roleSpecificMetrics as any)?.showApiKeyManagement && (
        <Card>
          <CardHeader>
            <CardTitle>API Integration</CardTitle>
            <CardDescription>Manage your API keys and webhook settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button variant="outline" size="sm">Manage API Keys</Button>
              <Button variant="outline" size="sm">Configure Webhooks</Button>
              <Button variant="outline" size="sm">View Documentation</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Dashboard;