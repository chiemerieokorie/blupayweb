import { Metadata } from 'next';
import { PageContainer } from '@/components/layout/page-container';
import CommissionsPage from '@/features/commissions';

export const metadata: Metadata = {
  title: 'Commissions - Blupay Africa',
  description: 'Configure and manage commission structures for transactions',
};

export default function Page() {
  return (
    <PageContainer>
      <CommissionsPage />
    </PageContainer>
  );
}