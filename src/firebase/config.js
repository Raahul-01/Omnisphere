import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Debug: Log environment variables (without exposing values)
console.log('Environment Variables Check:', {
  FIREBASE_API_KEY: !!process.env.REACT_APP_FIREBASE_API_KEY,
  FIREBASE_PROJECT_ID: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // Add other environment variables
});

let db;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  
  // Log successful initialization
  console.log('Firebase initialized successfully with project:', {
    projectId: app.options.projectId // This is safe to log
  });
} catch (error) {
  console.error('Firebase Initialization Error:', error);
  throw error;
}

export { db }; 