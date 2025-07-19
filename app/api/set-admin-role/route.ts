import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '../../lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    // Verify the token but don't use the decoded value since it's flagged as unused
    await adminAuth.verifyIdToken(token);

    // ⚠️ Optional: You can restrict to certain UID for safety in production
    // if (decoded.uid !== "YOUR_DEV_UID") {
    //   return NextResponse.json({ error: "Forbidden: Only dev allowed" }, { status: 403 });
    // }

    const { uid } = await req.json();
    if (!uid) {
      return NextResponse.json({ error: 'Missing UID' }, { status: 400 });
    }

    await adminAuth.setCustomUserClaims(uid, { role: 'admin' });

    return NextResponse.json({ success: true, message: `Admin role set for UID: ${uid}` });
  } catch (error: unknown) {
    console.error('Error setting admin role:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
