"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useToast } from "../../hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { NewProduct, Product } from "../../types";
import { addProduct } from "../../data/products";
import { productCategories } from "../../lib/constants/products";
import { CloudinaryUpload } from "../ui/cloudinary-upload";


const productFormSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  category: z.string().min(1, { message: "Category is required." }),
  imageUrl: z.string().min(1, { message: "Please upload an image." }),
  cloudinaryPublicId: z.string().optional(),
  imageHint: z.string()
    .min(1, { message: "Image hint is required." })
    .refine(value => value.split(" ").filter(Boolean).length <= 2, {
      message: "Image hint should be one or two keywords.",
    }),
  stock: z.coerce.number().int().nonnegative({ message: "Stock must be a non-negative integer." }),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  initialData?: ProductFormValues;
  onSubmitSuccess?: (data: Product) => void;
  cardTitle?: ReactNode;
  cardDescription?: ReactNode;
}

export function ProductForm({
  initialData,
  onSubmitSuccess,
  cardTitle = "Add New Product",
  cardDescription = "Fill in the details below to add a new product to the catalog."
}: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      category: "",
      imageUrl: "",
      cloudinaryPublicId: "",
      imageHint: "",
      stock: 0,
    },
  });

  async function onSubmit(values: ProductFormValues) {
    console.log("Submitting values:", values);
    setIsLoading(true);
    try {
      const newProductData: NewProduct = { ...values };
      const addedProduct = await addProduct(newProductData);

      toast({
        title: "Product Added Successfully",
        description: `${addedProduct.name} has been added to the catalog.`,
      });

      if (onSubmitSuccess) {
        onSubmitSuccess(addedProduct);
      } else {
        router.push("/admin/products");
        router.refresh();
      }

      if (!initialData) {
        form.reset();
      }

    } catch (error) {
      console.error("Failed to add product:", error);
      toast({
        title: "Error Adding Product",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Form {...form}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Cordless Drill Set" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the product..."
                      className="resize-y min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 49.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" step="1" placeholder="e.g., 100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {productCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <CloudinaryUpload
                      value={field.value}
                      onChange={(url, publicId) => {
                        field.onChange(url);
                        form.setValue('cloudinaryPublicId', publicId || '');
                      }}
                      onRemove={() => {
                        field.onChange('');
                        form.setValue('cloudinaryPublicId', '');
                      }}
                      disabled={isLoading}
                      folder="products"
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a high-quality image of the product. Maximum file size: 5MB.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Hint</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., power drill" {...field} />
                  </FormControl>
                  <FormDescription>
                    One or two keywords for AI image search (e.g., &quot;power drill&quot;).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white cursor-pointer" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Update Product" : "Add Product"}
            </Button>
          </Form>
        </form>
      </CardContent>
    </Card>
  );
}
