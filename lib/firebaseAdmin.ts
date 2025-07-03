import { cert, getApps, initializeApp, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function createServiceAccount(): ServiceAccount | null {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    // Missing environment variables – cannot initialize admin SDK
    return null;
  }

  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  } as ServiceAccount;
}

let db;

try {
  const serviceAccount = createServiceAccount();
  if (serviceAccount) {
    if (getApps().length === 0) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    }
    db = getFirestore();
  } else {
    console.warn('[Firebase Admin] Service account env vars are missing – falling back to client SDK');
  }
} catch (error) {
  console.error('[Firebase Admin] Initialization error:', error);
}

export { db as adminDb };