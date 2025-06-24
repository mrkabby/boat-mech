
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, CreditCard, CheckCircle, AlertCircle } from "lucide-react";
// ShippingAddress type will be imported from '@/types' if it's defined there.
// For now, schema defines the structure.

const checkoutFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  addressLine1: z.string().min(5, "Address line 1 is required."),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required."),
  postalCode: z
    .string()
    .min(3, "Postal code is required.")
    .regex(/^\d{5}(-\d{4})?$/, "Enter a valid US postal code (e.g., 12345 or 12345-6789)."),
  country: z.string().min(2, "Country is required."),
  phoneNumber: z.string().optional().refine(val => !val || /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(val), "Enter a valid phone number."),
  cardNumber: z
    .string()
    .min(15, "Card number must be 15-16 digits.")
    .max(19, "Card number must be 15-16 digits.") // Allowing for spaces
    .refine(
      (val) => /^\d{4}\s?\d{4}\s?\d{4}\s?\d{3,4}$/.test(val.replace(/\s/g, '')) || /^\d{15,16}$/.test(val.replace(/\s/g, '')), // Accepts with or without spaces
      "Enter a valid 15 or 16-digit card number."
    ),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, "Enter MM/YY or MM/YYYY."),
  cvc: z
    .string()
    .min(3, "CVC must be 3-4 digits.")
    .max(4, "CVC must be 3-4 digits.")
    .regex(/^\d{3,4}$/, "Enter a valid CVC (3 or 4 digits)."),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export function CheckoutForm() {
  const { cartItems, getCartTotal, clearCart, getItemCount } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      postalCode: "",
      country: "United States", // Default country
      phoneNumber: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
  });

  async function onSubmit(values: CheckoutFormValues) {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

    const paymentSuccessful = Math.random() > 0.1; // 90% success rate for demo

    if (paymentSuccessful) {
      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: "Thank you for your purchase. Your items are on their way.",
        action: <CheckCircle className="text-green-500 h-6 w-6" />,
      });
      router.push("/");
    } else {
      toast({
        title: "Payment Failed",
        description:
          "There was an issue processing your payment. Please check your details and try again.",
        variant: "destructive",
        action: <AlertCircle className="text-white h-6 w-6" />,
      });
    }
    setIsProcessing(false);
  }

  if (getItemCount() === 0 && !isProcessing) {
    // This check is important. If cart is empty, don't show form.
    // Could redirect from page level too.
     return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Your Cart is Empty</CardTitle>
          <CardDescription>You need items in your cart to proceed to checkout.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/')} className="w-full bg-primary hover:bg-primary/90">
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    );
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="shadow-lg rounded-lg overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-xl">Shipping Information</CardTitle>
                <CardDescription>
                  Enter your shipping address.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John M. Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressLine1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Marine Drive" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressLine2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2 (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apartment, suite, unit, building, floor, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Seaport City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="90210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="United States" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="(555) 123-4567 for delivery updates"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-lg overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-xl">Payment Details</CardTitle>
                <CardDescription>
                  Enter your payment information. This is a mock payment for
                  demonstration purposes.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="•••• •••• •••• ••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cvc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVC</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6 mt-6 rounded-md shadow-md"
              disabled={isProcessing || getItemCount() === 0}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing
                  Payment...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" /> Place Order & Pay $
                  {getCartTotal().toFixed(2)}
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="lg:col-span-1">
        <Card className="shadow-lg rounded-lg sticky top-24">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl">Order Summary</CardTitle>
            <CardDescription>
              You have {getItemCount()} item(s) in your cart.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start text-sm pb-3 border-b last:border-b-0"
              >
                <div className="flex-grow pr-2">
                  <p className="font-medium leading-tight">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold whitespace-nowrap">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between items-center text-lg font-bold border-t pt-4 mt-4 bg-muted/20">
            <span>Total:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
