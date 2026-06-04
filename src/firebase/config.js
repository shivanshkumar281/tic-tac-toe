import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.databaseURL
);

// init
let db = null;
if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
}

export { db };
