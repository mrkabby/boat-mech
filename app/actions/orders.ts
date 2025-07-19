"use server";

import { updateOrderStatus, deleteOrder } from '../lib/server/orders';
import { revalidatePath } from 'next/cache';
import { SerializedOrder } from '../types';

export async function updateOrderStatusAction(
  orderId: string, 
  status: SerializedOrder['status'],
  trackingNumber?: string
): Promise<void> {
  try {
    await updateOrderStatus(orderId, status, trackingNumber);
    revalidatePath('/admin/orders');
  } catch (error) {
    console.error('Error in updateOrderStatusAction:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update order status');
  }
}

export async function deleteOrderAction(orderId: string): Promise<void> {
  try {
    await deleteOrder(orderId);
    revalidatePath('/admin/orders');
  } catch (error) {
    console.error('Error in deleteOrderAction:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete order');
  }
}
