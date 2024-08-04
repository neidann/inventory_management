// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCM3SeBqSEGcDa5RSVBA1ffqc6b-JgXgNM",
  authDomain: "inventory-management-8f702.firebaseapp.com",
  projectId: "inventory-management-8f702",
  storageBucket: "inventory-management-8f702.appspot.com",
  messagingSenderId: "701655245910",
  appId: "1:701655245910:web:8ddeb412eb9f255e1d07f7",
  measurementId: "G-VYBT5V8VNG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export { firestore };