import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.crearQR = async function() {
    const nombre = document.getElementById("nombre").value;
    const tipo = document.getElementById("tipo").value;
    const qrDiv = document.getElementById("qr");

    if (!nombre) return alert("Ingresa el nombre del invitado");

    try {
        qrDiv.innerHTML = "Generando...";

        // 1. Guardar en la colección 'visitas'
        const docRef = await addDoc(collection(db, "visitas"), {
            nombre: nombre,
            tipo: tipo,
            casa: localStorage.getItem("casa") || "Sin Casa",
            autoriza: localStorage.getItem("usuario") || "Residente",
            timestamp: Date.now()
        });

        // 2. Guardar el ID para el botón de WhatsApp
        window.currentQrID = docRef.id;

        // 3. Crear el Link
        const linkPase = `https://valle-esmeralda-accesos.web.app/verqr.html?id=${docRef.id}`;

        // 4. Dibujar el QR en la pantalla (PC y Móvil)
        qrDiv.innerHTML = ""; // Limpiar el "Generando..."
        new QRCode(qrDiv, {
            text: linkPase,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        alert("✅ Pase creado con éxito");

    } catch (e) {
        console.error(e);
        alert("Error al conectar con Firebase");
        qrDiv.innerHTML = "Error";
    }
};

window.enviarWhats = function() {
    if (!window.currentQrID) return alert("Primero genera el QR");
    const tel = document.getElementById("telefono").value;
    if (!tel) return alert("Ingresa el número de WhatsApp");
    
    const link = `https://valle-esmeralda-accesos.web.app/verqr.html?id=${window.currentQrID}`;
    const msg = encodeURIComponent(`Hola! Este es tu pase de acceso para Valle Esmeralda: ${link}`);
    window.open(`https://wa.me/52${tel}?text=${msg}`);
};
