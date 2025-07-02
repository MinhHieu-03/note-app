// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgunBEuDkR-Sj5v8Yo9vsxZ-7pR31TKCQ",
  authDomain: "note-app-8c0e2.firebaseapp.com",
  projectId: "note-app-8c0e2",
  storageBucket: "note-app-8c0e2.firebasestorage.app",
  messagingSenderId: "934907358994",
  appId: "1:934907358994:web:730e452674035f947b0dcb",
  measurementId: "G-NQ1W201B4N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
