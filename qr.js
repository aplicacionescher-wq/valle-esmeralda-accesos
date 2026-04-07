import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.crearQR = async function() {
    const nombre = document.getElementById("nombre").value;
    const tel = document.getElementById("telefono").value;
    const tipo = document.getElementById("tipo").value;

    if (!nombre || !tel) return alert("Por favor, llena nombre y teléfono");

    try {
        const docRef = await addDoc(collection(db, "visitas"), {
            nombre: nombre,
            telefono: tel,
            tipo: tipo,
            casa: localStorage.getItem("casa"),
            autoriza: localStorage.getItem("usuario"),
            timestamp: Date.now()
        });

        const qrID = docRef.id;
        window.currentQrID = qrID; // Guardamos para el envío de WhatsApp

        // El link que visitará el invitado
        const link = `https://valle-esmeralda-accesos.web.app/verqr.html?id=${qrID}`;

        document.getElementById("qr").innerHTML = "";
        new QRCode(document.getElementById("qr"), {
            text: link,
            width: 200,
            height: 200
        });

        alert("Pase generado correctamente");
    } catch (e) {
        alert("Error al guardar en Firebase");
        console.error(e);
    }
};

window.enviarWhats = function() {
    if (!window.currentQrID) return alert("Primero genera el código");
    const tel = document.getElementById("telefono").value;
    const link = `https://valle-esmeralda-accesos.web.app/verqr.html?id=${window.currentQrID}`;
    const msg = encodeURIComponent(`Hola! Este es tu pase de acceso para Valle Esmeralda: ${link}`);
    window.open(`https://wa.me/52${tel}?text=${msg}`);
