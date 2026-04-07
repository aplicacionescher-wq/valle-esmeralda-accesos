import { db } from "./firebase.js";
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function login() {
    let usuario = document.getElementById("domicilio").value;
    let pass = document.getElementById("password").value;

    const q = query(collection(db, "usuarios"), where("domicilio", "==", usuario), where("password", "==", pass));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        alert("Usuario o contraseña incorrectos");
        return;
    }

    querySnapshot.forEach((doc) => {
        let data = doc.data();
        localStorage.setItem("rol", data.rol);
        localStorage.setItem("casa", data.domicilio);
        localStorage.setItem("usuario", data.nombre || "Residente"); // Fundamental para el QR

        if (data.rol === "admin") window.location.href = "admin.html";
        else if (data.rol === "residente") window.location.href = "dashboard.html";
        else if (data.rol === "caseta") window.location.href = "escaner.html";
    });
}
