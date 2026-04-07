import { db, storage } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

let datosVisita = null;
let html5QrCode = null;

function onScanSuccess(decodedText) {
    if (decodedText.startsWith("http")) {
        window.location.href = decodedText;
        return;
    }
    try {
        datosVisita = JSON.parse(decodedText);
        document.getElementById("resultado").innerHTML = `✅ PERMITIDO: ${datosVisita.nombre} (Casa ${datosVisita.casa})`;
    } catch (e) { document.getElementById("resultado").innerHTML = "⚠️ QR Inválido"; }
}

window.activarCamara = async function() {
    try {
        html5QrCode = new Html5Qrcode("reader");
        const devices = await Html5Qrcode.getCameras();
        if (devices.length) {
            await html5QrCode.start(devices[devices.length - 1].id, { fps: 10, qrbox: 250 }, onScanSuccess);
        }
    } catch (e) { alert("Usa HTTPS para activar la cámara"); }
};

window.guardarFoto = async function() {
    let archivo = document.getElementById("fotoCaseta").files[0];
    if (!archivo || !datosVisita) return alert("Escanea un QR y toma foto");
    
    let refImg = ref(storage, "registros/" + Date.now());
    await uploadBytes(refImg, archivo);
    let url = await getDownloadURL(refImg);

    await addDoc(collection(db, "registroAccesos"), { ...datosVisita, fotoEvidencia: url, fecha: Date.now() });
    alert("Acceso Registrado");
};
