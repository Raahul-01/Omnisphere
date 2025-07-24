import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

let app: App;
let adminDb: FirebaseFirestore.Firestore;
let auth: any;
let storage: any;

try {
  // Check if Firebase Admin is already initialized
  if (getApps().length === 0) {
    // Initialize Firebase Admin with service account
    const serviceAccount = require('../firebase-credentials.json');

    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: 'omnisphere-db8a7'
    });
  } else {
    app = getApps()[0];
  }

  // Initialize services
  adminDb = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);

} catch (error) {
  console.error('Firebase Admin initialization error:', error);

  // Fallback mock implementation if initialization fails
  const mockDb = {
    collection: (name: string) => ({
      orderBy: () => ({
        limit: () => ({
          get: async () => ({
            docs: [],
            empty: true
          })
        })
      }),
      doc: (id: string) => ({
        get: async () => ({
          exists: false,
          data: () => null,
          id
        })
      })
    })
  };

  adminDb = mockDb as any;
  auth = {
    getUser: async () => ({}),
    verifyIdToken: async () => ({})
  };
  storage = {
    bucket: () => ({})
  };
}

export { app, adminDb, auth, storage };