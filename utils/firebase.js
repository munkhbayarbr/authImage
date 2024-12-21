import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

const firebaseConfig = {
  apiKey: 'AIzaSyADcc8KvuU-ng1bCaPCxOHKAdtRkk8xDqs',
  authDomain: 'authimage-e7cbe.firebaseapp.com',
  projectId: 'authimage-e7cbe',
  storageBucket: 'authimage-e7cbe.appspot.com', // Corrected storage bucket
  messagingSenderId: '1060966921647',
  appId: '1:1060966921647:web:cc99f0a4fd7ed739d2eb5a',
  measurementId: 'G-5PFFZEW2D2',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Initialize and export Storage
