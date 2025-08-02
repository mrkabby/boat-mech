// app/lib/server/products.ts
"use server";

import { db } from "../firebaseClient"; // Fixed path
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import type { SerializedProduct } from "../../types";

export async function getProducts(): Promise<SerializedProduct[]> {
  const productsCol = collection(db, "products");
  const q = query(productsCol, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    
    // Handle timestamp conversion more safely
    let createdAt = new Date();
    let updatedAt = new Date();
    
    try {
      if (data.createdAt) {
        createdAt = (data.createdAt as Timestamp).toDate();
      }
    } catch (error) {
      console.warn('Failed to convert createdAt timestamp for product:', doc.id, error);
    }
    
    try {
      if (data.updatedAt) {
        updatedAt = (data.updatedAt as Timestamp).toDate();
      }
    } catch (error) {
      console.warn('Failed to convert updatedAt timestamp for product:', doc.id, error);
    }
    
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      imageUrl: data.imageUrl,
      imageHint: data.imageHint,
      stock: data.stock,
      rating: data.rating,
      reviews: data.reviews,
      createdAt,
      updatedAt,
    } as SerializedProduct;
  });
}

export async function getProductById(id: string): Promise<SerializedProduct | null> {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    
    // Handle timestamp conversion more safely
    let createdAt = new Date();
    let updatedAt = new Date();
    
    try {
      if (data.createdAt) {
        createdAt = (data.createdAt as Timestamp).toDate();
      }
    } catch (error) {
      console.warn('Failed to convert createdAt timestamp for product:', id, error);
    }
    
    try {
      if (data.updatedAt) {
        updatedAt = (data.updatedAt as Timestamp).toDate();
      }
    } catch (error) {
      console.warn('Failed to convert updatedAt timestamp for product:', id, error);
    }
    
    return {
      id: docSnap.id,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      imageUrl: data.imageUrl,
      imageHint: data.imageHint,
      stock: data.stock,
      rating: data.rating,
      reviews: data.reviews,
      cloudinaryPublicId: data.cloudinaryPublicId,
      createdAt,
      updatedAt,
    } as SerializedProduct;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
