import { db, storage } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

let datosVisita = null;
let html5QrCode = null;

// --- FUNCIÓN AL ESCANEAR CON ÉXITO ---
function onScanSuccess(decodedText) {
    let resultado = document.getElementById("resultado");
    let contenedorFoto = document.getElementById("contenedor-foto");

    // 1. Si el QR es un Link (Redirigir a verqr.html)
    if (decodedText.startsWith("http")) {
        resultado.innerHTML = "🔗 Link detectado. Redirigiendo...";
        window.location.href = decodedText;
        return;
    }

    // 2. Si el QR es JSON
    try {
        let data = JSON.parse(decodedText);
        datosVisita = data;
        let ahora = Date.now();
        let expiracion = { visita: 86400000, proveedor: 43200000, uber: 7200000, paqueteria: 43200000 };

        if (ahora - data.timestamp > (expiracion[data.tipo] || 86400000)) {
            resultado.innerHTML = "<h3 style='color:#ef4444;'>❌ PASE EXPIRADO</h3>";
            datosVisita = null;
        } else {
            resultado.innerHTML = `
                <h3 style='color:#22c55e;'>✅ ACCESO VÁLIDO</h3>
                <b>Invitado:</b> ${data.nombre}<br>
                <b>Casa:</b> ${data.casa}
            `;
            if (data.fotoURL) {
                contenedorFoto.innerHTML = `<img src="${data.fotoURL}" style="width:150px; border-radius:10px; margin-top:10px;">`;
            }
        }
        
        if(html5QrCode) html5QrCode.stop();

    } catch (error) {
        resultado.innerHTML = "⚠️ Código QR no reconocido.";
    }
}

// --- ACTIVAR CÁMARA TRASERA (CORREGIDO) ---
window.activarCamara = async function() {
    const mensaje = document.getElementById("mensaje");
    mensaje.innerHTML = "🔄 Buscando cámara trasera...";

    if (html5QrCode) {
        await html5QrCode.stop().catch(() => {});
    }

    html5QrCode = new Html5Qrcode("reader");

    try {
        // Forzamos el uso de la cámara trasera usando 'environment'
        const config = { fps: 15, qrbox: { width: 250, height: 250 } };
        
        await html5QrCode.start(
            { facingMode: "environment" }, // <--- ESTO FUERZA LA CÁMARA TRASERA
            config,
            onScanSuccess
        );
        
        mensaje.innerHTML = "✅ Escáner activo (Cámara Trasera)";
    } catch (err) {
        console.error("Error con facingMode, intentando selección manual:", err);
        
        // Si falla el modo automático, buscamos manualmente la cámara que diga "back" o la última de la lista
        try {
            const devices = await Html5Qrcode.getCameras();
            if (devices && devices.length > 0) {
                // Intentamos encontrar una que diga 'back' o simplemente tomamos la última (suele ser la principal)
                let backCamera = devices.find(device => device.label.toLowerCase().includes('back'));
                let camId = backCamera ? backCamera.id : devices[devices.length - 1].id;

                await html5QrCode.start(camId, { fps: 15, qrbox: 250 }, onScanSuccess);
                mensaje.innerHTML = "✅ Escáner activo (Manual)";
            } else {
                mensaje.innerHTML = "❌ No se detectaron cámaras.";
            }
        } catch (manualErr) {
            mensaje.innerHTML = "❌ Error: Asegúrate de usar HTTPS y dar permisos.";
            alert("Error: " + manualErr);
        }
    }
};

// --- GUARDAR INGRESO ---
window.guardarFoto = async function() {
    if (!datosVisita) return alert("Escanea un QR primero");
    let archivo = document.getElementById("fotoCaseta").files[0];
    if (!archivo) return alert("Toma la foto de evidencia");

    try {
        document.getElementById("resultado").innerHTML = "⏳ Guardando...";
        let storageRef = ref(storage, "ingresos/" + Date.now());
        await uploadBytes(storageRef, archivo);
        let url = await getDownloadURL(storageRef);

        await addDoc(collection(db, "registroAccesos"), {
            ...datosVisita,
            fotoEvidencia: url,
            fechaIngreso: Date.now()
        });

        alert("Acceso Registrado");
        location.reload();
    } catch (e) { alert("Error al guardar"); }
};
