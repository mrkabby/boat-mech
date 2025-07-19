const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin (for testing permissions)
if (!admin.apps.length) {
  const credentials = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(credentials),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

async function testImageUploadSetup() {
  console.log('🧪 Testing Image Upload Setup...\n');

  try {
    // Test 1: Check if Storage is accessible
    console.log('1. Testing Firebase Storage access...');
    const bucket = admin.storage().bucket();
    const [exists] = await bucket.exists();
    
    if (exists) {
      console.log('   ✅ Firebase Storage bucket is accessible');
    } else {
      console.log('   ❌ Firebase Storage bucket not found');
      return;
    }

    // Test 2: Check storage rules (by trying to list files)
    console.log('2. Testing storage permissions...');
    try {
      const [files] = await bucket.getFiles({ prefix: 'products/', maxResults: 1 });
      console.log('   ✅ Storage rules allow admin access');
    } catch (error) {
      console.log('   ⚠️  Storage rules test inconclusive:', error.message);
    }

    // Test 3: Check if we can create a test file
    console.log('3. Testing file upload capability...');
    const testFile = bucket.file('test/upload-test.txt');
    await testFile.save('This is a test file created by the setup script.');
    console.log('   ✅ File upload works');

    // Clean up test file
    await testFile.delete();
    console.log('   ✅ File cleanup works');

    // Test 4: Check environment variables
    console.log('4. Checking required environment variables...');
    const requiredVars = [
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'FIREBASE_ADMIN_PROJECT_ID',
      'FIREBASE_ADMIN_CLIENT_EMAIL',
      'FIREBASE_ADMIN_PRIVATE_KEY'
    ];

    let allVarsPresent = true;
    for (const varName of requiredVars) {
      if (process.env[varName]) {
        console.log(`   ✅ ${varName} is set`);
      } else {
        console.log(`   ❌ ${varName} is missing`);
        allVarsPresent = false;
      }
    }

    if (allVarsPresent) {
      console.log('\n🎉 Image upload setup is ready!');
      console.log('\nNext steps:');
      console.log('1. Deploy storage rules: firebase deploy --only storage');
      console.log('2. Test image upload at: http://localhost:3000/admin/products/new');
      console.log('3. Make sure you have admin role set for your user');
    } else {
      console.log('\n❌ Please fix missing environment variables');
    }

  } catch (error) {
    console.error('❌ Setup test failed:', error.message);
  }

  process.exit(0);
}

testImageUploadSetup();
