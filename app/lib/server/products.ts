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
      // Convert Firestore Timestamps to plain Date objects for serialization
      createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
      updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : new Date(),
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
      // Convert Firestore Timestamps to plain Date objects for serialization
      createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
      updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : new Date(),
    } as SerializedProduct;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
