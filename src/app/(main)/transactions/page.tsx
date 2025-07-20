import { Metadata } from 'next';
import { PageContainer } from '@/components/layout/page-container';
import TransactionsPage from '@/features/transactions';

export const metadata: Metadata = {
  title: 'Transactions - Blupay Africa',
  description: 'Manage and monitor all transactions',
};

export default function Page() {
  return (
    <PageContainer>
      <TransactionsPage />
    </PageContainer>
  );
}