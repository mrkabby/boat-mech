import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '../../lib/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token);

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ error: 'Missing UID' }, { status: 400 });
    }

    await adminAuth.setCustomUserClaims(uid, { role: 'admin' });

    return NextResponse.json({ success: true, message: `Admin role set for UID: ${uid}` });
  } catch (error: any) {
    console.error('Error setting admin role:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
