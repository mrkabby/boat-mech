
// src/app/api/set-user-role/route.ts
import { adminAuth, adminDb } from '../../lib/firebaseAdmin';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

interface RequestBody {
  uid: string;
  role: 'user' | 'admin';
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { uid, role } = body;

    if (!uid || !role) {
      return NextResponse.json({ error: 'Missing uid or role' }, { status: 400 });
    }

    if (role !== 'user' && role !== 'admin') {
      return NextResponse.json({ error: 'Invalid role. Must be "user" or "admin".' }, { status: 400 });
    }

    // Get the current user to validate they exist
    const userRecord = await adminAuth.getUser(uid);
    
    // Set custom claims for Firebase Auth
    await adminAuth.setCustomUserClaims(uid, { role });

    // Also update the role in the Firestore 'users' collection
    const userDocRef = adminDb.collection('users').doc(uid);
    const userDocSnap = await userDocRef.get();

    if (!userDocSnap.exists) {
        // Create user document if it doesn't exist
        console.warn(`User document for UID ${uid} does not exist in Firestore. Creating new document.`);
        
        await userDocRef.set({
            role,
            email: userRecord.email || "unknown",
            name: userRecord.displayName || "Unknown User",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    } else {
        // Update existing user document
        await userDocRef.update({
            role,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }

    return NextResponse.json({ 
      message: `User role updated to ${role}`,
      uid,
      role
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error updating user role:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'auth/user-not-found') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
