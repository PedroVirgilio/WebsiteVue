// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore'; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTyWFRaKT52WHKCWirOMrc9tqlIn88XoQ",
  authDomain: "websitevue-c4ac0.firebaseapp.com",
  projectId: "websitevue-c4ac0",
  storageBucket: "websitevue-c4ac0.appspot.com",
  messagingSenderId: "121105837539",
  appId: "1:121105837539:web:51b1754f5713e9b59a04d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// Initialize Firestore and get a reference
const db = getFirestore(app); // Initialize Firestore

// Export the auth, storage, and db objects
export { auth, storage, db }; // Include db in the export
