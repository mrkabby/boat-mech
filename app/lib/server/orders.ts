import { adminDb } from '../firebaseAdmin';
import { Order, SerializedOrder } from '../../types';
import * as admin from 'firebase-admin';

export async function getOrders(): Promise<SerializedOrder[]> {
  try {
    const ordersSnapshot = await adminDb
      .collection('orders')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();

    const orders: SerializedOrder[] = [];
    
    ordersSnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Order, 'id'>;
      orders.push({
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as admin.firestore.Timestamp).toDate(),
        updatedAt: (data.updatedAt as admin.firestore.Timestamp).toDate(),
      });
    });

    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
}

export async function updateOrderStatus(
  orderId: string, 
  status: Order['status'],
  trackingNumber?: string
): Promise<void> {
  try {
    const orderRef = adminDb.collection('orders').doc(orderId);
    const updateData: { [key: string]: unknown } = {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    await orderRef.update(updateData);
    console.log(`Successfully updated order ${orderId} status to ${status}`);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw new Error(`Failed to update order status: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getOrderById(orderId: string): Promise<SerializedOrder | null> {
  try {
    const orderDoc = await adminDb.collection('orders').doc(orderId).get();
    
    if (!orderDoc.exists) {
      return null;
    }

    const data = orderDoc.data() as Omit<Order, 'id'>;
    return {
      id: orderDoc.id,
      ...data,
      createdAt: (data.createdAt as admin.firestore.Timestamp).toDate(),
      updatedAt: (data.updatedAt as admin.firestore.Timestamp).toDate(),
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order');
  }
}

export async function deleteOrder(orderId: string): Promise<void> {
  try {
    await adminDb.collection('orders').doc(orderId).delete();
    console.log(`Successfully deleted order ${orderId}`);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw new Error(`Failed to delete order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
