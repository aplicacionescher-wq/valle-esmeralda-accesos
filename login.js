import { db } from "./firebase.js";

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const auth = getAuth();

window.login = async function () {

  const correo = document.getElementById("correo").value;
  const password = document.getElementById("password").value;

  try {

    const userCredential = await signInWithEmailAndPassword(auth, correo, password);
    const uid = userCredential.user.uid;

    const ref = doc(db, "usuarios", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      alert("Usuario sin rol");
      return;
    }

    const data = snap.data();

    // 🔐 Redirección por rol
    if (data.rol === "admin") {
      window.location.href = "admin.html";
    } else if (data.rol === "caseta") {
      window.location.href = "escaner.html";
    } else {
      window.location.href = "generar.html";
    }

  } catch (error) {
    document.getElementById("error").innerText = "Error de login";
  }

};
