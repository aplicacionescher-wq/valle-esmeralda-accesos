import { db, storage } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

let datosQR = null;
let scanner = null;

function onScanSuccess(text) {
    try {
        if (text.startsWith("http")) { window.location.href = text; return; }
        datosQR = JSON.parse(text);
        const expiracion = { visita: 86400000, uber: 7200000, proveedor: 43200000 };
        const ahora = Date.now();

        if (ahora - datosQR.timestamp > expiracion[datosQR.tipo]) {
            document.getElementById("resultado").innerHTML = "<h3 style='color:red;'>EXPIRADO</h3>";
        } else {
            document.getElementById("resultado").innerHTML = `<h3 style='color:green;'>VALIDO</h3>${datosQR.nombre}<br>Casa: ${datosQR.casa}`;
        }
    } catch (e) { document.getElementById("resultado").innerText = "Código inválido"; }
}

window.activarCamara = async function() {
    scanner = new Html5Qrcode("reader");
    const cams = await Html5Qrcode.getCameras();
    if (cams.length) {
        await scanner.start(cams[cams.length - 1].id, { fps: 10, qrbox: 250 }, onScanSuccess);
    }
};

window.guardarFoto = async function() {
    const file = document.getElementById("fotoCaseta").files[0];
    if (!file || !datosQR) return alert("Escanea primero y toma foto");
    const imgRef = ref(storage, "ingresos/" + Date.now());
    await uploadBytes(imgRef, file);
    const url = await getDownloadURL(imgRef);
    await addDoc(collection(db, "registroAccesos"), { ...datosQR, fotoEvidencia: url, fecha: Date.now() });
    alert("Entrada registrada");
    location.reload();
};
