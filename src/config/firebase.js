import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBxzTKy4vi9VcGFM7kg4pePDukB-aWhoAA",
  authDomain: "premium-hsc-notes.firebaseapp.com",
  projectId: "premium-hsc-notes",
  storageBucket: "premium-hsc-notes.firebasestorage.app",
  messagingSenderId: "938896449795",
  appId: "1:938896449795:web:73f7516e756df73aea0936"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
