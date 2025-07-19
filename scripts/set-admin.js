#!/usr/bin/env node

/**
 * Script to set a user as admin
 * Usage: node scripts/set-admin.js <uid>
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

async function setAdminRole(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
    console.log(`✅ Successfully set admin role for user: ${uid}`);
    
    // Verify the claims were set
    const user = await admin.auth().getUser(uid);
    console.log('User custom claims:', user.customClaims);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting admin role:', error.message);
    process.exit(1);
  }
}

// Get UID from command line argument
const uid = process.argv[2];

if (!uid) {
  console.error('Usage: node scripts/set-admin.js <uid>');
  console.error('Example: node scripts/set-admin.js abc123xyz789');
  process.exit(1);
}

// Check environment variables
const requiredVars = [
  'FIREBASE_ADMIN_PROJECT_ID',
  'FIREBASE_ADMIN_CLIENT_EMAIL',
  'FIREBASE_ADMIN_PRIVATE_KEY'
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`  - ${varName}`));
  console.error('\nMake sure to set up your .env.local file properly.');
  process.exit(1);
}

setAdminRole(uid);
