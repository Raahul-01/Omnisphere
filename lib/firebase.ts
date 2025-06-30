// Mock Firebase implementation for development
// This avoids the undici compatibility issues

export const db = {
  collection: () => ({
    doc: () => ({
      get: () => Promise.resolve({ data: () => ({}) }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve(),
    }),
    add: () => Promise.resolve({ id: 'mock-doc-id' }),
    where: () => ({
      orderBy: () => ({
        limit: () => ({
          get: () => Promise.resolve({ docs: [] })
        })
      })
    }),
    orderBy: () => ({
      limit: () => ({
        get: () => Promise.resolve({ docs: [] })
      })
    }),
    get: () => Promise.resolve({ docs: [] })
  })
};

export const auth = {
  currentUser: null,
  signInWithEmailAndPassword: (email: string, password: string) => Promise.resolve({ user: { uid: '1', email, displayName: 'Demo User' } }),
  createUserWithEmailAndPassword: (email: string, password: string) => Promise.resolve({ user: { uid: '1', email, displayName: 'Demo User' } }),
  signOut: () => Promise.resolve(),
  onAuthStateChanged: (callback: any) => {
    callback(null);
    return () => {};
  }
};

const app = {
  options: {
    projectId: 'demo-project'
  }
};

export default app;