// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "realestate-mern-9ba5f.firebaseapp.com",
  projectId: "realestate-mern-9ba5f",
  storageBucket: "realestate-mern-9ba5f.appspot.com",
  messagingSenderId: "387416537574",
  appId: "1:387416537574:web:58511c757a298f81d77e27"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);