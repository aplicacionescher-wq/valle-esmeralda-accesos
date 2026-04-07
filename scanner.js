import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let html5QrCode = null;

async function onScanSuccess(decodedText) {
    const resDiv = document.getElementById("resultado");
    let idBusqueda = "";

    // 1. Extraer ID si es un link o si es texto directo
    if (decodedText.includes("id=")) {
        idBusqueda = new URLSearchParams(decodedText.split('?')[1]).get("id");
    } else {
        idBusqueda = decodedText;
    }

    try {
        resDiv.innerHTML = "🔍 Validando...";
        const snap = await getDoc(doc(db, "visitas", idBusqueda));

        if (snap.exists()) {
            const d = snap.data();
            resDiv.innerHTML = `
                <div style="background:#064e3b; padding:15px; border:2px solid #22c55e; border-radius:10px;">
                    <h2 style="color:#22c55e; margin:0;">✅ ACCESO VÁLIDO</h2>
                    <p><b>Invitado:</b> ${d.nombre}</p>
                    <p><b>Casa:</b> ${d.casa}</p>
                    <p><b>Tipo:</b> ${d.tipo.toUpperCase()}</p>
                </div>
            `;
            // Vibración de éxito (en Android)
            if(navigator.vibrate) navigator.vibrate(200);
            if(html5QrCode) html5QrCode.stop(); 
        } else {
            resDiv.innerHTML = "<h2 style='color:#ef4444;'>❌ PASE INVÁLIDO</h2>";
        }
    } catch (e) {
        resDiv.innerHTML = "⚠️ Error de red";
    }
}

window.activarCamara = function() {
    if (!html5QrCode) html5QrCode = new Html5Qrcode("reader");
    
    // CONFIGURACIÓN DE ESCANEO RÁPIDO
    html5QrCode.start(
        { facingMode: "environment" },
        { 
            fps: 20,          // Escanea el doble de rápido (antes era 10)
            qrbox: { width: 280, height: 280 }, // Caja más grande para apuntar fácil
            aspectRatio: 1.0 
        },
        onScanSuccess
    ).catch(err => alert("Error de cámara: " + err));
};
