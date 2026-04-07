import { db, storage } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

let qrID = "";

window.crearQR = async function() {
    const casa = localStorage.getItem("casa") || "N/A";
    const autoriza = localStorage.getItem("usuario") || "Residente";
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const tipo = document.getElementById("tipo").value;

    if (!nombre || !telefono) return alert("Nombre y teléfono obligatorios");

    const archivo = document.getElementById("foto").files[0];
    let fotoURL = "";

    try {
        if (archivo) {
            const referencia = ref(storage, "ids/" + Date.now());
            await uploadBytes(referencia, archivo);
            fotoURL = await getDownloadURL(referencia);
        }

        const docRef = await addDoc(collection(db, "visitas"), {
            casa, autoriza, nombre, telefono, tipo, fotoURL,
            timestamp: Date.now(), usado: false
        });

        qrID = docRef.id;
        const link = "https://valle-esmeralda-accesos.web.app/verqr.html?id=" + qrID;

        document.getElementById("qr").innerHTML = "";
        new QRCode(document.getElementById("qr"), { text: link, width: 220, height: 220 });
        alert("Pase generado correctamente");
    } catch (e) { alert("Error al guardar datos"); }
};

window.enviarWhats = function() {
    if (!qrID) return alert("Primero genera el QR");
    const tel = document.getElementById("telefono").value;
    const link = "https://valle-esmeralda-accesos.web.app/verqr.html?id=" + qrID;
    const msg = `ACCESO VALLE ESMERALDA\n\nVisitante: ${document.getElementById("nombre").value}\nPresenta este link en caseta:\n${link}`;
    window.open(`https://wa.me/52${tel}?text=${encodeURIComponent(msg)}`);
};
