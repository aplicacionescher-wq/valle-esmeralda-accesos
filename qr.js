import { db, storage } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

let qrID = "";

window.crearQR = async function() {
    let casa = localStorage.getItem("casa") || "N/A";
    let autoriza = localStorage.getItem("usuario") || "Residente";
    let nombre = document.getElementById("nombre").value;
    let telefono = document.getElementById("telefono").value;
    let tipo = document.getElementById("tipo").value;

    if (!nombre || !telefono) return alert("Completa nombre y teléfono");

    let archivo = document.getElementById("foto").files[0];
    let fotoURL = "";

    try {
        if (archivo) {
            let referencia = ref(storage, "ids/" + Date.now());
            await uploadBytes(referencia, archivo);
            fotoURL = await getDownloadURL(referencia);
        }

        let docRef = await addDoc(collection(db, "visitas"), {
            casa, autoriza, nombre, telefono, tipo, fotoURL,
            timestamp: Date.now(), usado: false
        });

        qrID = docRef.id;
        let qrLink = `${window.location.origin}/verqr.html?id=${qrID}`;

        document.getElementById("qr").innerHTML = "";
        new QRCode(document.getElementById("qr"), { text: qrLink, width: 220, height: 220 });
        alert("QR Generado");
    } catch (e) { alert("Error al guardar datos"); }
};

window.enviarWhats = function() {
    if (!qrID) return alert("Primero genera el QR");
    let telefono = document.getElementById("telefono").value;
    let qrLink = `${window.location.origin}/verqr.html?id=${qrID}`;
    let mensaje = encodeURIComponent(`ACCESO AUTORIZADO\nValle Esmeralda\n\nPresenta este link en caseta:\n${qrLink}`);
    window.open(`https://wa.me/52${telefono}?text=${mensaje}`);
};
