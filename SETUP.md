# Boat Mech - Environment Setup Guide

## Firebase Configuration

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Create a new project called "boat-mech"
3. Enable Authentication (Email/Password)
4. Create Firestore database
5. Set up Firebase Storage (for product images)

### Step 2: Get Configuration Values
1. Go to Project Settings > General
2. Scroll down to "Your apps" section
3. Click "Web app" and register your app
4. Copy the configuration values

### Step 3: Create .env.local file
Copy the .env.local.example file and fill in your actual values:

```bash
cp .env.local.example .env.local
```

### Step 4: Set up Firebase Admin SDK
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the values for .env.local

### Step 5: Deploy Firestore Rules
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init firestore`
4. Deploy rules: `firebase deploy --only firestore:rules`

## Required Environment Variables

```env
# Firebase Client (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (Required for server operations)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=

# Optional
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=
```
