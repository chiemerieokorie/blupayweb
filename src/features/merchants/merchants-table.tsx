'use client';

import {useState, Fragment} from 'react';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
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
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Download,
    Users,
    Key
} from 'lucide-react';
import {Merchant} from '@/sdk/types';
import {useMerchant} from './hooks';

interface MerchantsTableProps {
    merchants: Merchant[];
    loading?: boolean;
    pagination?: {
        page: number;
        perPage: number;
        total: number;
        totalPages: number;
    };
    onPageChange?: (page: number) => void;
    onViewMerchant?: (merchant: Merchant) => void;
    onEditMerchant?: (merchant: Merchant) => void;
    onViewSubMerchants?: (merchant: Merchant) => void;
    onManageApiKeys?: (merchant: Merchant) => void;
}

export function MerchantsTable({
                                   merchants,
                                   loading,
                                   pagination,
                                   onPageChange,
                                   onViewMerchant,
                                   onEditMerchant,
                                   onViewSubMerchants,
                                   onManageApiKeys,
                               }: MerchantsTableProps) {
    const {remove} = useMerchant();
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

    const handleDelete = async (merchantId: string) => {
        if (confirm('Are you sure you want to delete this merchant?')) {
            try {
                setDeleteLoading(merchantId);
                await remove(merchantId);
            } catch (error) {
                console.error('Delete failed:', error);
            } finally {
                setDeleteLoading(null);
            }
        }
    };

    const formatAmount = (amount: number) => {
        return new Intl.NumberFormat('en-GH', {
            style: 'currency',
            currency: 'GHS',
        }).format(amount);
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Merchants</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {Array.from({length: 5}).map((_, i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"/>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Fragment>
            {merchants.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    No merchants found
                </div>
            ) : (
                <>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Merchant</TableHead>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Country</TableHead>
                                    <TableHead>Services</TableHead>
                                    <TableHead>Partner Bank</TableHead>
                                    <TableHead className="w-[70px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {merchants.map((merchant) => (
                                    <TableRow key={merchant.uuid}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{merchant.merchantName}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {merchant.notificationEmail}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-mono text-sm">
                                                {merchant.merchantCode}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{merchant.country}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {merchant.canProcessMomoTransactions && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Mobile Money
                                                    </Badge>
                                                )}
                                                {merchant.canProcessCardTransactions && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Cards
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">{merchant.partnerBankId}</div>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        disabled={deleteLoading === merchant.uuid}
                                                    >
                                                        <MoreHorizontal className="h-4 w-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => onViewMerchant?.(merchant)}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4"/>
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onEditMerchant?.(merchant)}
                                                    >
                                                        <Edit className="mr-2 h-4 w-4"/>
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem
                                                        onClick={() => onViewSubMerchants?.(merchant)}
                                                    >
                                                        <Users className="mr-2 h-4 w-4"/>
                                                        Sub-Merchants
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => onManageApiKeys?.(merchant)}
                                                    >
                                                        <Key className="mr-2 h-4 w-4"/>
                                                        API Keys
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator/>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(merchant.uuid)}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4"/>
                                                        Delete
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
                                {pagination.total} merchants
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onPageChange?.(pagination.page - 1)}
                                    disabled={pagination.page <= 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2"/>
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
                                    <ChevronRight className="h-4 w-4 ml-2"/>
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </Fragment>
    );
}