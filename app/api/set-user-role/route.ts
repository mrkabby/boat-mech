
// src/app/api/set-user-role/route.ts
import { adminAuth, adminDb } from '../../lib/firebaseAdmin';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';

interface RequestBody {
  uid: string;
  role: 'user' | 'admin';
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { uid, role } = body;

    if (!uid || !role) {
      return NextResponse.json({ message: 'Missing UID or role' }, { status: 400 });
    }

    if (role !== 'user' && role !== 'admin') {
      return NextResponse.json({ message: 'Invalid role specified. Must be "user" or "admin".' }, { status: 400 });
    }

    // Check if user exists in Auth
    try {
        await adminAuth.getUser(uid);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            return NextResponse.json({ message: 'User not found in Firebase Authentication.' }, { status: 404 });
        }
        throw error; // Re-throw other auth errors
    }
    
    // Set custom claims for Firebase Auth
    await adminAuth.setCustomUserClaims(uid, { role });

    // Also update the role in the Firestore 'users' collection
    const userDocRef = doc(adminDb, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
        // This case should ideally not happen if users are created in Firestore on signup.
        // If it does, you might want to create the user document here or return an error.
        // For now, we'll proceed assuming it might be a new system or an edge case.
        // Or, strictly, one might argue to return an error if Firestore doc doesn't exist.
         console.warn(`User document for UID ${uid} not found in Firestore. Role claim set in Auth, but Firestore document not updated as it's missing.`);
         // Decide if this is an error or just a warning. For robustness, let's try to update or create.
         // For simplicity, we'll just try to update. If it fails, it's an issue.
    }

    await updateDoc(userDocRef, {
      role: role,
      updatedAt: serverTimestamp(),
    }).catch(async (updateError: any) => {
        // If update fails because doc doesn't exist, try to set it (create it)
        if (updateError.code === 'not-found' || (updateError.message && updateError.message.includes("No document to update"))) {
            console.warn(`User document for UID ${uid} not found, creating it with new role.`);
            // Fetch minimal user info from Auth if needed to populate, or just set role.
            // For now, just role and timestamp.
            const authUser = await adminAuth.getUser(uid);
            await adminDb.collection('users').doc(uid).set({
                email: authUser.email, // Good to store email for consistency
                name: authUser.displayName || authUser.email?.split('@')[0], // Best effort for name
                role: role,
                createdAt: serverTimestamp(), // Or fetch existing if possible, this is simpler
                updatedAt: serverTimestamp(),
            }, { merge: true }); // Merge true in case some fields were there partially
        } else {
            throw updateError; // Re-throw other update errors
        }
    });


    return NextResponse.json({ message: `Role successfully set to ${role} for user ${uid} in Auth claims and Firestore. User may need to re-authenticate or refresh token to see changes immediately.` }, { status: 200 });
  } catch (error: any) {
    console.error('Error setting custom claim and updating Firestore:', error);
    let errorMessage = 'Failed to set role.';
    if (error.code === 'auth/user-not-found') { // This check might be redundant due to earlier check
        errorMessage = 'User not found. Please ensure the UID is correct.';
        return NextResponse.json({ message: errorMessage }, { status: 404 });
    }
    return NextResponse.json({ message: errorMessage, error: error.message || String(error) }, { status: 500 });
  }
}
