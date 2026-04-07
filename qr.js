import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.crearQR = async function() {
    const nombre = document.getElementById("nombre").value;
    const tipo = document.getElementById("tipo").value;

    if (!nombre) return alert("Escribe el nombre del visitante");

    try {
        // Guardamos en la colección "visitas" (como dice tu regla)
        const docRef = await addDoc(collection(db, "visitas"), {
            nombre: nombre,
            tipo: tipo,
            casa: localStorage.getItem("casa") || "Sin Casa",
            autoriza: localStorage.getItem("usuario") || "Residente",
            timestamp: Date.now()
        });

        // El ID que Firebase generó es docRef.id
        const qrID = docRef.id;
        // IMPORTANTE: El link debe apuntar a verqr.html con el ID
        const link = "https://tu-proyecto.web.app/verqr.html?id=" + qrID;

        document.getElementById("qr").innerHTML = "";
        new QRCode(document.getElementById("qr"), { text: link, width: 200, height: 200 });
        
        alert("Pase generado y guardado en Firebase");
    } catch (e) {
        console.error(e);
        alert("Error al guardar: " + e.message);
    }
};
