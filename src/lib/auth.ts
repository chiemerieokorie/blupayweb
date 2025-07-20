import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { UserRole } from '@/sdk/types';

export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    redirect('/auth/login');
  }
  return session;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const session = await getServerSession();
  if (!session) {
    redirect('/auth/login');
  }
  
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/unauthorized');
  }
  
  return session;
}

export function getUserPermissions(role: UserRole) {
  const permissions = {
    ADMIN: [
      'view_all_merchants',
      'create_merchant',
      'edit_merchant',
      'delete_merchant',
      'view_all_transactions',
      'view_all_users',
      'create_user',
      'edit_user',
      'delete_user',
      'view_partner_banks',
      'create_partner_bank',
      'edit_partner_bank',
      'delete_partner_bank',
      'view_devices',
      'create_device',
      'edit_device',
      'delete_device',
      'view_analytics',
    ],
    MERCHANT: [
      'view_own_merchant',
      'edit_own_merchant',
      'view_own_transactions',
      'create_transaction',
      'view_own_users',
      'create_sub_merchant',
      'edit_sub_merchant',
      'view_own_analytics',
      'manage_api_keys',
      'manage_webhooks',
    ],
    PARTNER_BANK: [
      'view_assigned_merchants',
      'create_merchant',
      'edit_assigned_merchant',
      'view_assigned_transactions',
      'view_assigned_users',
      'view_assigned_devices',
      'assign_device',
      'view_partner_analytics',
    ],
    SUB_MERCHANT: [
      'view_own_merchant',
      'view_own_transactions',
      'create_transaction',
      'view_own_analytics',
    ],
  };

  return permissions[role] || [];
}

export function hasPermission(userRole: UserRole, permission: string): boolean {
  const userPermissions = getUserPermissions(userRole);
  return userPermissions.includes(permission);
}