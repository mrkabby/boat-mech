
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfigValues = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Helper to map internal config keys to their full environment variable names
const internalKeyToEnvVar: Record<string, string> = {
  apiKey: 'NEXT_PUBLIC_FIREBASE_API_KEY',
  authDomain: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  projectId: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  storageBucket: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'NEXT_PUBLIC_FIREBASE_APP_ID',
};

const requiredConfigKeys: (keyof typeof firebaseConfigValues)[] = [
  'apiKey',
  'authDomain',
  'projectId',
];

let effectiveConfig = { ...firebaseConfigValues };
const missingKeys = requiredConfigKeys.filter(key => !effectiveConfig[key]);

if (missingKeys.length > 0) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
`************************************************************************************
WARNING: Firebase configuration error!
Missing required environment variables:
${missingKeys.map(key => internalKeyToEnvVar[key]).join('\n')}

Falling back to placeholder values for development.
Firebase functionality will NOT work correctly.
Please create a .env.local file with your Firebase project's credentials.
See .env.local.example for the required format and restart the development server.
************************************************************************************`
    );
    // Use placeholder values for development to allow the app to run
    // These placeholders are syntactically valid enough for initializeApp but won't connect.
    effectiveConfig = {
      apiKey: effectiveConfig.apiKey || "MISSING_OR_PLACEHOLDER_API_KEY",
      authDomain: effectiveConfig.authDomain || "missing-project-id.firebaseapp.com",
      projectId: effectiveConfig.projectId || "missing-project-id",
      storageBucket: effectiveConfig.storageBucket || "missing-project-id.appspot.com",
      messagingSenderId: effectiveConfig.messagingSenderId || "MISSING_MESSAGING_SENDER_ID",
      appId: effectiveConfig.appId || "MISSING_APP_ID",
    };
    
    // After applying placeholders, ensure all required keys actually have a value.
    // This is a safeguard; the logic above should ensure this.
    const stillMissingRequired = requiredConfigKeys.filter(key => !effectiveConfig[key]);
    if (stillMissingRequired.length > 0) {
        // This should ideally not be reached if placeholders are assigned correctly.
        throw new Error(
         `Internal error during Firebase config: Placeholder assignment failed for required keys: ${stillMissingRequired.join(', ')}`
        );
    }

  } else {
    // In production, always throw an error for missing configuration
    throw new Error(
      `Firebase configuration error: Missing required environment variables: ${missingKeys
        .map(key => internalKeyToEnvVar[key] || `UNKNOWN_ENV_VAR_FOR_${key}`)
        .join(', ')}. ` +
      `Please ensure these are set in your deployment environment.`
    );
  }
}

// Ensure all keys in the effectiveConfig are strings, as Firebase expects
const firebaseConfig = Object.fromEntries(
  Object.entries(effectiveConfig).map(([key, value]) => [key, String(value)])
);

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
