// Migration script to add timestamps to existing products
"use server";

import { db } from "../firebaseClient";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  FieldValue,
} from "firebase/firestore";

export async function addTimestampsToExistingProducts() {
  try {
    const productsCol = collection(db, "products");
    const snapshot = await getDocs(productsCol);
    
    let updatedCount = 0;
    
    for (const productDoc of snapshot.docs) {
      const data = productDoc.data();
      
      // Check if timestamps are missing
      if (!data.createdAt || !data.updatedAt) {
        const updates: { [key: string]: FieldValue } = {};
        
        if (!data.createdAt) {
          updates.createdAt = serverTimestamp();
        }
        
        if (!data.updatedAt) {
          updates.updatedAt = serverTimestamp();
        }
        
        await updateDoc(doc(db, "products", productDoc.id), updates);
        updatedCount++;
        console.log(`Updated product ${productDoc.id} with timestamps`);
      }
    }
    
    console.log(`Migration completed. Updated ${updatedCount} products.`);
    return { success: true, updatedCount };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
