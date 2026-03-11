import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {

apiKey: "AIzaSy...",
authDomain: "valle-esmeralda-accesos.firebaseapp.com",
projectId: "valle-esmeralda-accesos",
storageBucket: "valle-esmeralda-accesos.appspot.com",
messagingSenderId: "1075927284762",
appId: "1:1075927284762:web:xxxx"

};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
