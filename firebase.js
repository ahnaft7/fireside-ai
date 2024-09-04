// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHBKh1WpnAkTK9JPJ-47-GiF5DeLd0xWs",
  authDomain: "fireside-ai.firebaseapp.com",
  projectId: "fireside-ai",
  storageBucket: "fireside-ai.appspot.com",
  messagingSenderId: "629790478095",
  appId: "1:629790478095:web:44557bf66b1ce8d3abb87a",
  measurementId: "G-DJ8VFH78QK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
// const analytics = getAnalytics(app);

export {db}