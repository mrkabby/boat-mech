const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin
if (!admin.apps.length) {
  const credentials = {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });
}

const db = admin.firestore();

async function clearSampleProducts() {
  try {
    console.log('🗑️  Removing all sample products...');
    
    // Get all products
    const productsSnapshot = await db.collection('products').get();
    
    if (productsSnapshot.empty) {
      console.log('📭 No products found in the database.');
      process.exit(0);
    }

    console.log(`Found ${productsSnapshot.size} products to delete.`);

    // Delete all products
    const batch = db.batch();
    productsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    console.log('✅ All sample products have been removed successfully!');
    console.log(`🗑️  Deleted ${productsSnapshot.size} products.`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error removing sample products:', error);
    process.exit(1);
  }
}

clearSampleProducts();
