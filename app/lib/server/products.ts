// app/lib/server/products.ts
"use server";

import { db } from "../../lib/firebaseClient"; // or firebaseAdmin if you prefer admin access
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import type { Product } from "@/types";

export async function getProducts(): Promise<Product[]> {
  const productsCol = collection(db, "products");
  const q = query(productsCol, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt as Timestamp,
      updatedAt: data.updatedAt as Timestamp,
    } as Product;
  });
}
