import { Badge } from '@/components/ui/badge';
import { getStatusBadgeVariant } from '../utils';

interface TransactionStatusBadgeProps {
  status: string;
  className?: string;
}

export function TransactionStatusBadge({ status, className }: TransactionStatusBadgeProps) {
  return (
    <Badge variant={getStatusBadgeVariant(status)} className={className}>
      {status}
    </Badge>
  );
}