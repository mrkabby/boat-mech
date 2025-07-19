"use server";

import { updateUserRole, toggleUserStatus } from '../lib/server/users';
import { revalidatePath } from 'next/cache';

export async function updateUserRoleAction(uid: string, role: 'user' | 'admin'): Promise<void> {
  try {
    await updateUserRole(uid, role);
    revalidatePath('/admin/users');
  } catch (error) {
    console.error('Error in updateUserRoleAction:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update user role');
  }
}

export async function toggleUserStatusAction(uid: string, disabled: boolean): Promise<void> {
  try {
    await toggleUserStatus(uid, disabled);
    revalidatePath('/admin/users');
  } catch (error) {
    console.error('Error in toggleUserStatusAction:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update user status');
  }
}
