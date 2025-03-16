// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtL1Mq25D528N2D3FYc5TtCcT1YB9vM9I",
  authDomain: "nomster-17166.firebaseapp.com",
  projectId: "nomster-17166",
  storageBucket: "nomster-17166.firebasestorage.app",
  messagingSenderId: "370111442021",
  appId: "1:370111442021:web:72f42aaffd9276b564aa8c",
  measurementId: "G-MXZ2Z5HW49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);