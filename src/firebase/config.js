import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  // Make sure all these fields are correctly filled
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Debug: Log environment variables (without exposing values)
console.log('Environment Variables Check:', {
  FIREBASE_API_KEY: !!process.env.REACT_APP_FIREBASE_API_KEY,
  FIREBASE_PROJECT_ID: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // Add other environment variables
});

try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Enable offline persistence
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log('Offline persistence enabled');
    })
    .catch((err) => {
      console.error('Error enabling offline persistence:', err);
    });

  console.log('Firebase Initialization Success:', {
    isAppInitialized: !!app,
    isDbInitialized: !!db,
    projectId: app.options.projectId // This is safe to log
  });

  export { db };
} catch (error) {
  console.error('Firebase Initialization Error:', error);
  throw error;
} 