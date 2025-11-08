/*************Tempered Details***************/

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzowkdyBD4NTkw2TjhrtsnhasdsPLLRDeIaIjo",
  authDomain: "buybusy-1-e5a9c.firebaseapp.com",
  projectId: "buybusy-1-e5g9c",
  storageBucket: "buybusy-1-e5a9c.firebasestorage.app",
  messagingSenderId: "32193485676883",
  appId: "1:32193485676883:web:760dd41ureokjhy73ac3946",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
