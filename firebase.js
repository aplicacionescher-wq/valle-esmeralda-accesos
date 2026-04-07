import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js"

const firebaseConfig = {

apiKey: "AIzaSyCgK2hbNsL7kgUEQFFbuweiStbfbijKtX8",

authDomain: "valle-esmeralda-accesos.firebaseapp.com",

projectId: "valle-esmeralda-accesos",

storageBucket: "valle-esmeralda-accesos.appspot.com",

messagingSenderId: "1075927284762",

appId: "1:1075927284762:web:635b74230f88d8740e65a3",

measurementId: "G-WCC09W0Y5W"

}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const storage = getStorage(app)
