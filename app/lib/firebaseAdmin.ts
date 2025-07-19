// src/lib/firebaseAdmin.ts
import admin from 'firebase-admin';

interface FirebaseAdminCredentials {
  projectId?: string;
  clientEmail?: string;
  privateKey?: string;
}

// Add debugging to check if environment variables are loaded
if (process.env.NODE_ENV !== 'production') {
  console.log('Environment check:', {
    hasProjectId: !!process.env.FIREBASE_ADMIN_PROJECT_ID,
    hasClientEmail: !!process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    hasPrivateKey: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    nodeEnv: process.env.NODE_ENV
  });
}

// Retrieve credentials from environment variables
const adminCredentials: FirebaseAdminCredentials = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

let adminApp: admin.app.App;
let adminAuthService: admin.auth.Auth;
let adminDbService: admin.firestore.Firestore;

try {
  if (admin.apps.length === 0) {
    const missingKeys = (Object.keys(adminCredentials) as Array<keyof FirebaseAdminCredentials>)
      .filter(key => !adminCredentials[key]);

    if (missingKeys.length > 0) {
      const errorMessage = `Firebase Admin SDK initialization failed: Missing environment variables: ${missingKeys.join(', ')}. 
      Please set these in your .env.local file. Refer to Firebase project service account JSON key.
      For FIREBASE_ADMIN_PRIVATE_KEY, ensure newlines are correctly formatted (e.g., use '\\n' in .env.local).
      
      Current values:
      - FIREBASE_ADMIN_PROJECT_ID: ${adminCredentials.projectId ? 'SET' : 'MISSING'}
      - FIREBASE_ADMIN_CLIENT_EMAIL: ${adminCredentials.clientEmail ? 'SET' : 'MISSING'}  
    - FIREBASE_ADMIN_PRIVATE_KEY: ${adminCredentials.privateKey ? 'SET' : 'MISSING'}`;
    
    console.error(errorMessage);
    
    // For development, we'll throw an error to make it clear what's missing
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(errorMessage);
    }
    
    // In production, you might want to handle this differently
    throw new Error('Firebase Admin SDK configuration is incomplete');
  }

  try {
    console.log('Attempting to initialize Firebase Admin SDK...');
    
    adminApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: adminCredentials.projectId!,
        clientEmail: adminCredentials.clientEmail!,
        privateKey: adminCredentials.privateKey!,
      }),
    });
    
    adminAuthService = adminApp.auth();
    adminDbService = adminApp.firestore();
    
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error: any) {
    const initErrorMessage = 'Firebase Admin SDK initialization error: ' + (error.message || error);
    console.error('❌ Firebase Admin SDK initialization failed:', initErrorMessage);
    console.error('Error details:', error);
    throw new Error(initErrorMessage);
  }
} else {
  // Already initialized
  adminApp = admin.apps[0]!;
  adminAuthService = adminApp.auth();
  adminDbService = adminApp.firestore();
}
} catch (globalError: any) {
  console.error('❌ Critical Firebase Admin SDK error:', globalError);
  throw new Error(`Firebase Admin SDK failed to initialize: ${globalError.message}`);
}

export const adminAuth = adminAuthService;
export const adminDb = adminDbService;
// Example: export const adminStorage = adminApp.storage(); // If needed

/**
 * IMPORTANT: This module initializes the Firebase Admin SDK.
 * It should ONLY be imported and used in server-side code 
 * (e.g., API routes, Server Components, getServerSideProps/generateStaticParams in Pages Router).
 * Importing it into client-side code will lead to build errors or runtime issues.
 * 
 * To use the Firebase Admin SDK, you need to:
 * 1. Go to your Firebase project console (https://console.firebase.google.com/).
 * 2. Navigate to Project settings (click the gear icon near "Project Overview").
 * 3. Go to the "Service accounts" tab.
 * 4. Under "Firebase Admin SDK", select your preferred language (Node.js is relevant here)
 *    and click "Generate new private key". A JSON file will be downloaded.
 * 5. Create or update your `.env.local` file in the root of your project.
 * 6. Add the following environment variables, using the values from the downloaded JSON key file:
 *    FIREBASE_ADMIN_PROJECT_ID=your_project_id_from_json
 *    FIREBASE_ADMIN_CLIENT_EMAIL=your_client_email_from_json
 *    FIREBASE_ADMIN_PRIVATE_KEY="your_private_key_from_json_with_newlines_escaped_as_\\n"
 *    
 *    Example for FIREBASE_ADMIN_PRIVATE_KEY (note the surrounding quotes and escaped newlines if storing as a single line):
 *    FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD...\\n-----END PRIVATE KEY-----\\n"
 * 
 *    Alternatively, if your .env system or deployment environment supports true multi-line values within quotes, 
 *    you can paste the private key directly, preserving actual newlines:
 *    FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
 *    MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD...
 *    -----END PRIVATE KEY-----"
 *    (The `.replace(/\\n/g, '\n')` in this file's code is designed to handle the escaped newline format,
 *    making it robust for various ways the key might be stored in an environment variable.)
 * 
 * 7. Restart your development server (e.g., `npm run dev`) for the new environment variables to take effect.
 */
