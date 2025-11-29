import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDetH7c37C1dLDRHcpvpnYHV9dGAdtbU2M",
  authDomain: "afriframe-booking.firebaseapp.com",
  projectId: "afriframe-booking",
  storageBucket: "afriframe-booking.firebasestorage.app",
  messagingSenderId: "635405179262",
  appId: "1:635405179262:web:e23a0d7121c58146bfbb2f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
