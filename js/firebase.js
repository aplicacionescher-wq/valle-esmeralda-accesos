// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgK2hbNsL7kgUEQFFbuweiStbfbijKtX8",
  authDomain: "valle-esmeralda-accesos.firebaseapp.com",
  projectId: "valle-esmeralda-accesos",
  storageBucket: "valle-esmeralda-accesos.firebasestorage.app",
  messagingSenderId: "1075927284762",
  appId: "1:1075927284762:web:635b74230f88d8740e65a3",
  measurementId: "G-WCC09W0Y5W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
