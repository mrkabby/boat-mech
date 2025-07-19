import { adminAuth, adminDb } from '../firebaseAdmin';
import * as admin from 'firebase-admin';

export interface UserRecord {
  uid: string;
  email: string | undefined;
  displayName: string | undefined;
  role: 'user' | 'admin';
  emailVerified: boolean;
  disabled: boolean;
  creationTime: string;
  lastSignInTime: string | undefined;
}

export async function getUsers(): Promise<UserRecord[]> {
  try {
    const listUsersResult = await adminAuth.listUsers(100); // Get up to 100 users
    const users: UserRecord[] = [];

    for (const userRecord of listUsersResult.users) {
      // Get custom claims to check role
      const customClaims = userRecord.customClaims || {};
      const role = (customClaims.role as 'user' | 'admin') || 'user';

      users.push({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        role,
        emailVerified: userRecord.emailVerified,
        disabled: userRecord.disabled,
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
      });
    }

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

export async function updateUserRole(uid: string, role: 'user' | 'admin'): Promise<void> {
  try {
    // Set custom claims
    await adminAuth.setCustomUserClaims(uid, { role });

    // Also update Firestore for consistency
    const userDocRef = adminDb.collection('users').doc(uid);
    await userDocRef.update({
      role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Successfully updated role for user ${uid} to ${role}`);
  } catch (error) {
    console.error('Error updating user role:', error);
    throw new Error(`Failed to update user role: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function toggleUserStatus(uid: string, disabled: boolean): Promise<void> {
  try {
    await adminAuth.updateUser(uid, { disabled });
    console.log(`Successfully ${disabled ? 'disabled' : 'enabled'} user ${uid}`);
  } catch (error) {
    console.error('Error updating user status:', error);
    throw new Error(`Failed to update user status: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
