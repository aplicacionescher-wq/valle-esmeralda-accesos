import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.crearQR = async function() {
    const nombre = document.getElementById("nombre").value;
    const tipo = document.getElementById("tipo").value;
    const qrDiv = document.getElementById("qr");

    if (!nombre) return alert("Ingresa el nombre del invitado");

    try {
        qrDiv.innerHTML = "Generando...";

        // 1. Guardar en Firebase (Capa gratuita)
        const docRef = await addDoc(collection(db, "visitas"), {
            nombre: nombre,
            tipo: tipo,
            casa: localStorage.getItem("casa") || "Sin Casa",
            autoriza: localStorage.getItem("usuario") || "Residente",
            timestamp: Date.now()
        });

        window.currentQrID = docRef.id;

        // 2. IMPORTANTE: El link que el guardia también sabrá leer
        const linkPase = `https://valle-esmeralda-accesos.web.app/verqr.html?id=${docRef.id}`;

        qrDiv.innerHTML = ""; 
        new QRCode(qrDiv, {
            text: linkPase, // El QR físico contiene el LINK con el ID
            width: 200,
            height: 200,
            correctLevel: QRCode.CorrectLevel.H
        });

        alert("✅ Pase creado y asociado en Firebase");

    } catch (e) {
        console.error(e);
        alert("Error al conectar con Firebase");
    }
};

window.enviarWhats = function() {
    if (!window.currentQrID) return alert("Primero genera el QR");
    const tel = document.getElementById("telefono").value;
    const link = `https://valle-esmeralda-accesos.web.app/verqr.html?id=${window.currentQrID}`;
    
    // Solo enviamos el link (el invitado abre el link y el guardia escanea el QR que sale en ese link)
    const msg = encodeURIComponent(`Hola! Este es tu pase de acceso para Valle Esmeralda: ${link}`);
    window.open(`https://wa.me/52${tel}?text=${msg}`);
};
