"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { 
  Loader2, 
  MapPin, 
  CreditCard, 
  Edit,
  Package,
  Truck,
  User,
  Phone
} from 'lucide-react';

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        firstname?: string;
        lastname?: string;
        phone?: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => {
        openIframe: () => void;
      };
    };
  }
}

interface DeliveryDetails {
  fullName: string;
  phone: string;
  gpsAddress: string;
  landmark: string;
  area: string;
  city: string;
  region: string;
  additionalDirections: string;
}

export function CheckoutForm() {
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    fullName: user?.name || '',
    phone: '',
    gpsAddress: '',
    landmark: '',
    area: '',
    city: '',
    region: 'Greater Accra',
    additionalDirections: ''
  });
  const [editingAddress, setEditingAddress] = useState(false);
  const [hasProfileAddress, setHasProfileAddress] = useState(false);

  useEffect(() => {
    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const checkProfileAddress = async () => {
      try {
        const savedAddress = localStorage.getItem(`delivery_${user?.email}`);
        if (savedAddress) {
          const parsed = JSON.parse(savedAddress);
          setDeliveryDetails(prev => ({
            ...prev,
            ...parsed
          }));
          setHasProfileAddress(true);
        } else {
          setEditingAddress(true);
        }
      } catch (error) {
        console.error('Error loading profile address:', error);
        setEditingAddress(true);
      }
    };

    if (user) {
      checkProfileAddress();
    }
  }, [user]);

  const handlePayment = async () => {
    if (!deliveryDetails.fullName || !deliveryDetails.phone || !deliveryDetails.city) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required delivery details.",
        variant: "destructive",
      });
      return;
    }

    if (!window.PaystackPop) {
      toast({
        title: "Payment Error",
        description: "Payment system is not available. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const totalAmount = (getCartTotal() + 15) * 100; // Paystack expects amount in kobo
    
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_your_key_here',
      email: user?.email || '',
      amount: totalAmount,
      currency: 'GHS',
      firstname: deliveryDetails.fullName.split(' ')[0],
      lastname: deliveryDetails.fullName.split(' ').slice(1).join(' '),
      phone: deliveryDetails.phone,
      metadata: {
        custom_fields: [
          {
            display_name: "Cart Items",
            variable_name: "cart_items",
            value: JSON.stringify(cartItems.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })))
          },
          {
            display_name: "Delivery Address",
            variable_name: "delivery_address",
            value: JSON.stringify(deliveryDetails)
          }
        ]
      },
      callback: function(response: { reference: string }) {
        console.log('Payment successful:', response);
        
        localStorage.setItem(`delivery_${user?.email}`, JSON.stringify(deliveryDetails));
        clearCart();
        
        toast({
          title: "Payment Successful!",
          description: `Your order has been placed. Reference: ${response.reference}`,
        });
        
        router.push(`/order-success?ref=${response.reference}`);
        setIsLoading(false);
      },
      onClose: function() {
        toast({
          title: "Payment Cancelled",
          description: "Your payment was cancelled. Your cart is still available.",
        });
        setIsLoading(false);
      }
    });

    handler.openIframe();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Delivery Information */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Truck className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-black">Delivery Information</CardTitle>
              </div>
              {hasProfileAddress && !editingAddress && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingAddress(true)}
                  className="text-black border-gray-300 hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
            <CardDescription className="text-gray-600">
              {hasProfileAddress && !editingAddress 
                ? "Using your saved delivery address"
                : "Enter your delivery details"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!editingAddress && hasProfileAddress ? (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-black">{deliveryDetails.fullName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">{deliveryDetails.phone}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div className="text-gray-700">
                    {deliveryDetails.gpsAddress && <p>GPS: {deliveryDetails.gpsAddress}</p>}
                    {deliveryDetails.landmark && <p>Near: {deliveryDetails.landmark}</p>}
                    <p>{deliveryDetails.area}, {deliveryDetails.city}</p>
                    <p>{deliveryDetails.region}, Ghana</p>
                    {deliveryDetails.additionalDirections && (
                      <p className="text-sm text-gray-600 mt-1">{deliveryDetails.additionalDirections}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={deliveryDetails.fullName}
                      onChange={(e) => setDeliveryDetails(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={deliveryDetails.phone}
                      onChange={(e) => setDeliveryDetails(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+233 24 123 4567"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gpsAddress">GPS Address</Label>
                  <Input
                    id="gpsAddress"
                    value={deliveryDetails.gpsAddress}
                    onChange={(e) => setDeliveryDetails(prev => ({ ...prev, gpsAddress: e.target.value }))}
                    placeholder="GA-123-4567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    value={deliveryDetails.landmark}
                    onChange={(e) => setDeliveryDetails(prev => ({ ...prev, landmark: e.target.value }))}
                    placeholder="Near Accra Mall"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area">Area *</Label>
                    <Input
                      id="area"
                      value={deliveryDetails.area}
                      onChange={(e) => setDeliveryDetails(prev => ({ ...prev, area: e.target.value }))}
                      placeholder="East Legon"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={deliveryDetails.city}
                      onChange={(e) => setDeliveryDetails(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Accra"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <select
                    id="region"
                    value={deliveryDetails.region}
                    onChange={(e) => setDeliveryDetails(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="Greater Accra">Greater Accra</option>
                    <option value="Ashanti">Ashanti</option>
                    <option value="Western">Western</option>
                    <option value="Central">Central</option>
                    <option value="Eastern">Eastern</option>
                    <option value="Northern">Northern</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalDirections">Additional Directions</Label>
                  <Textarea
                    id="additionalDirections"
                    value={deliveryDetails.additionalDirections}
                    onChange={(e) => setDeliveryDetails(prev => ({ ...prev, additionalDirections: e.target.value }))}
                    placeholder="Turn left after the traffic light, white gate with blue doors..."
                    rows={3}
                  />
                </div>
                
                {hasProfileAddress && (
                  <Button
                    variant="outline"
                    onClick={() => setEditingAddress(false)}
                    className="w-full text-black border-gray-300 hover:bg-gray-50"
                  >
                    Use Saved Address
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="border-gray-200 sticky top-4">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-gray-600" />
              <CardTitle className="text-black">Order Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {cartItems && cartItems.length > 0 ? cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-black">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-black">₵{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-4">No items in cart</p>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₵{getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>₵15.00</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold text-black">
                <span>Total</span>
                <span>₵{(getCartTotal() + 15).toFixed(2)}</span>
              </div>
            </div>
            
            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-black hover:bg-gray-800 text-white mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay with Paystack
                </>
              )}
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              Secure payment powered by Paystack
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
