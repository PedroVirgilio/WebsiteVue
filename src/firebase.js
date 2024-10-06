// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

const storage = getStorage(app);

export { auth,  storage };