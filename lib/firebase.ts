import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project", 
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdefghijklmnop"
};

// Initialize Firebase (avoid multiple initialization)
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create a minimal app object for fallback
  app = { options: { projectId: 'demo-project' } };
}

// Initialize Firestore
let db;
let auth;

try {
  db = getFirestore(app);
  auth = getAuth(app);
  
  // Connect to emulators in development if available
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
    } catch (error) {
      // Emulator already connected or not available
      console.log('Firestore emulator not connected:', error.message);
    }
    
    try {
      connectAuthEmulator(auth, 'http://localhost:9099');
    } catch (error) {
      // Emulator already connected or not available  
      console.log('Auth emulator not connected:', error.message);
    }
  }
} catch (error) {
  console.error('Firebase services initialization error:', error);
  
  // Create mock services for fallback
  db = {
    // Mock Firestore methods
    collection: () => ({
      get: () => Promise.resolve({ docs: [] }),
      orderBy: () => ({ limit: () => ({ get: () => Promise.resolve({ docs: [] }) }) })
    })
  };
  
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      callback(null);
      return () => {};
    }
  };
}

export { db, auth };
export default app;