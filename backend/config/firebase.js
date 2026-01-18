import admin from 'firebase-admin';

/**
 * Firebase Admin SDK Configuration
 * 
 * Initializes Firebase Admin SDK for backend authentication
 * Reads credentials from environment variables
 */

let firebaseAdmin = null;

try {
  // Check if Firebase credentials are provided
  if (!process.env.FIREBASE_PROJECT_ID) {
    console.warn('⚠️  Firebase credentials not configured. Authentication will not work.');
    console.warn('   Set FIREBASE_PROJECT_ID and FIREBASE_PRIVATE_KEY in .env');
  } else {
    // Initialize Firebase Admin SDK
    // Option 1: Using service account JSON (if FIREBASE_SERVICE_ACCOUNT is set)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    }
    // Option 2: Using individual environment variables
    else if (process.env.FIREBASE_PRIVATE_KEY) {
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
      });
    }
    // Option 3: Using default credentials (for Google Cloud environments)
    else {
      firebaseAdmin = admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    }

    console.log('✅ Firebase Admin SDK initialized');
  }
} catch (error) {
  console.error('❌ Firebase Admin SDK initialization error:', error.message);
  console.warn('⚠️  Authentication will not work until Firebase is properly configured');
}

/**
 * Verify Firebase ID Token
 * @param {string} idToken - Firebase ID token from client
 * @returns {Promise<admin.auth.DecodedIdToken>} Decoded token with user info
 */
export const verifyIdToken = async (idToken) => {
  if (!firebaseAdmin) {
    throw new Error('Firebase Admin SDK not initialized');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
};

export default firebaseAdmin;
