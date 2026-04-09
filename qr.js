import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let qrGeneradoID = null;

// 🔥 CREAR QR
window.crearQR = async function () {

    const nombre = document.getElementById("nombre").value.trim();
    const tipo = document.getElementById("tipo").value;

    if (!nombre) {
        alert("⚠️ Ingresa un nombre");
        return;
    }

    document.getElementById("loader").style.display = "block";
    document.getElementById("btnGen").disabled = true;

    try {

        // 🔥 GUARDAR EN FIREBASE
        const docRef = await addDoc(collection(db, "visitas"), {
            nombre,
            tipo,
            estado: "pendiente",
            fecha: serverTimestamp()
        });

        // 🔥 ESTE ES EL ID REAL
        qrGeneradoID = docRef.id;

        console.log("ID GENERADO:", qrGeneradoID);

        // 🔥 GENERAR QR CON EL ID
        const qrDiv = document.getElementById("qr");
        qrDiv.innerHTML = "";

        new QRCode(qrDiv, {
            text: qrGeneradoID, // 🔥 AQUÍ ESTÁ LA CLAVE
            width: 220,
            height: 220
        });

        document.getElementById("qr-container").style.display = "block";
        document.getElementById("btnWhats").style.display = "block";

    } catch (error) {
        console.error(error);
        alert("❌ Error al guardar en Firebase");
    }

    document.getElementById("loader").style.display = "none";
    document.getElementById("btnGen").disabled = false;
};

// 🔥 ENVIAR POR WHATSAPP
window.enviarWhats = async function () {

    const qrContainer = document.getElementById("qr-container");

    const canvas = await html2canvas(qrContainer);
    const imgData = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = imgData;
    link.download = "qr.png";
    link.click();

    alert("📲 Imagen lista. Compártela por WhatsApp.");
};
