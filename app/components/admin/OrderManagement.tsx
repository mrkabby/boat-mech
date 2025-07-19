"use client";

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { SerializedOrder } from '../../types';
import { Package, Eye, Truck, DollarSign, Calendar, User, MapPin, Trash2 } from 'lucide-react';

interface OrderManagementProps {
  initialOrders: SerializedOrder[];
  onUpdateStatus: (orderId: string, status: SerializedOrder['status'], trackingNumber?: string) => Promise<void>;
  onDeleteOrder: (orderId: string) => Promise<void>;
}

export default function OrderManagement({ initialOrders, onUpdateStatus, onDeleteOrder }: OrderManagementProps) {
  const [orders, setOrders] = useState<SerializedOrder[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<SerializedOrder | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleStatusUpdate = async (orderId: string, newStatus: SerializedOrder['status']) => {
    try {
      await onUpdateStatus(orderId, newStatus, trackingNumber || undefined);
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus, trackingNumber: trackingNumber || order.trackingNumber } : order
      ));

      toast({
        title: "Order Updated",
        description: `Order status updated to ${newStatus} successfully.`,
      });
      
      setTrackingNumber('');
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update order: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await onDeleteOrder(orderId);
      
      setOrders(prev => prev.filter(order => order.id !== orderId));

      toast({
        title: "Order Deleted",
        description: "Order deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete order: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeVariant = (status: SerializedOrder['status']) => {
    switch (status) {
      case 'delivered': return 'default';
      case 'shipped': return 'secondary';
      case 'processing': return 'outline';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPaymentStatusBadgeVariant = (status: SerializedOrder['paymentStatus']) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'secondary';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const totalRevenue = orders.reduce((sum, order) => 
    order.paymentStatus === 'paid' ? sum + order.totalAmount : sum, 0
  );

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <Package className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{orderStats.total}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Truck className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Shipped</p>
              <p className="text-2xl font-bold">{orderStats.shipped}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Package className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Delivered</p>
              <p className="text-2xl font-bold">{orderStats.delivered}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Management
          </CardTitle>
          <CardDescription>
            Manage customer orders, update statuses, and track shipments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-mono text-sm">
                        {order.id.substring(0, 8)}...
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{order.userEmail}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {order.shippingAddress.city}, {order.shippingAddress.country}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className="text-sm">{order.items.length} item(s)</span>
                    </TableCell>
                    
                    <TableCell>
                      <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                      {order.trackingNumber && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Track: {order.trackingNumber}
                        </div>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(order.createdAt)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Order Details</DialogTitle>
                              <DialogDescription>
                                Order ID: {selectedOrder?.id}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium">Customer Information</h4>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.userEmail}</p>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress.fullName}</p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium">Shipping Address</h4>
                                    <div className="text-sm text-muted-foreground">
                                      <p>{selectedOrder.shippingAddress.addressLine1}</p>
                                      {selectedOrder.shippingAddress.addressLine2 && (
                                        <p>{selectedOrder.shippingAddress.addressLine2}</p>
                                      )}
                                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                                      <p>{selectedOrder.shippingAddress.country}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium mb-2">Order Items</h4>
                                  <div className="space-y-2">
                                    {selectedOrder.items.map((item, index) => (
                                      <div key={index} className="flex justify-between items-center p-2 border rounded">
                                        <div>
                                          <p className="font-medium">{item.productName}</p>
                                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="mt-4 pt-4 border-t">
                                    <div className="flex justify-between items-center font-bold">
                                      <span>Total:</span>
                                      <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Select
                          value={order.status}
                          onValueChange={(value: SerializedOrder['status']) => 
                            startTransition(() => handleStatusUpdate(order.id, value))
                          }
                          disabled={isPending}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>

                        {order.status === 'shipped' && !order.trackingNumber && (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Tracking #"
                              value={trackingNumber}
                              onChange={(e) => setTrackingNumber(e.target.value)}
                              className="w-32"
                            />
                            <Button
                              size="sm"
                              onClick={() => startTransition(() => handleStatusUpdate(order.id, 'shipped'))}
                              disabled={!trackingNumber || isPending}
                            >
                              Add
                            </Button>
                          </div>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" disabled={isPending}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Order</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this order? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => startTransition(() => handleDeleteOrder(order.id))}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
