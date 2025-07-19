import { auth } from '../firebase';
import type { Product, NewProduct } from '../types';
import {
  collection,
  addDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export const addProduct = async (newProductData: NewProduct): Promise<Product> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("User is not authenticated");

  const tokenResult = await currentUser.getIdTokenResult(true); // Force refresh
  if (tokenResult.claims.role !== 'admin') {
    throw new Error("You do not have permission to add products");
  }

  const productWithTimestamps = {
    ...newProductData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'products'), productWithTimestamps);
  const newDocSnap = await getDoc(docRef);

  if (!newDocSnap.exists()) {
    throw new Error("Failed to fetch newly created product.");
  }

  return {
    id: docRef.id,
    ...newDocSnap.data(),
  } as Product;
};
