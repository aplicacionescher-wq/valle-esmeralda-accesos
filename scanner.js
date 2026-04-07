import { db, storage } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

let datosVisita = null;
let html5QrCode = null;

// --- FUNCIÓN AL ESCANEAR CON ÉXITO ---
function onScanSuccess(decodedText) {
    let resultado = document.getElementById("resultado");
    let contenedorFoto = document.getElementById("contenedor-foto");

    // 1. Si el QR es un Link (QR generado por qr.js)
    if (decodedText.startsWith("http")) {
        resultado.innerHTML = "🔗 Link detectado. Redirigiendo para validar...";
        window.location.href = decodedText; // Redirige a verqr.html
        return;
    }

    // 2. Si el QR contiene el JSON (QR directo)
    try {
        let data = JSON.parse(decodedText);
        datosVisita = data;

        let ahora = Date.now();
        // Tiempos de expiración (milisegundos)
        let expiracion = {
            visita: 86400000,     // 24h
            proveedor: 43200000,  // 12h
            uber: 7200000,        // 2h
            paqueteria: 43200000  // 12h
        };

        // VALIDACIÓN DE TIEMPO
        if (ahora - data.timestamp > (expiracion[data.tipo] || 86400000)) {
            resultado.innerHTML = "<h3 style='color:#ef4444;'>❌ PASE EXPIRADO</h3>";
            datosVisita = null;
        } else {
            resultado.innerHTML = `
                <h3 style='color:#22c55e;'>✅ ACCESO VÁLIDO</h3>
                <b>Invitado:</b> ${data.nombre}<br>
                <b>Casa:</b> ${data.casa}<br>
                <b>Tipo:</b> ${data.tipo.toUpperCase()}
            `;
            // Si hay foto del visitante en el QR, mostrarla
            if (data.fotoURL) {
                contenedorFoto.innerHTML = `<img src="${data.fotoURL}" id="foto-visitante">`;
            }
        }
        
        // Detener cámara tras éxito para ahorrar batería
        if(html5QrCode) html5QrCode.stop();

    } catch (error) {
        resultado.innerHTML = "⚠️ Código QR no reconocido o dañado.";
        console.error("Error al parsear QR:", error);
    }
}

// --- ACTIVAR CÁMARA ---
window.activarCamara = async function() {
    const mensaje = document.getElementById("mensaje");
    mensaje.innerHTML = "Cargando cámara...";

    try {
        html5QrCode = new Html5Qrcode("reader");
        const devices = await Html5Qrcode.getCameras();

        if (devices && devices.length) {
            // Selecciona la cámara trasera si existe
            let camaraId = devices[devices.length - 1].id; 
            
            await html5QrCode.start(
                camaraId,
                { fps: 10, qrbox: 250 },
                onScanSuccess
            );
            mensaje.innerHTML = "✅ Escáner activo";
        } else {
            mensaje.innerHTML = "❌ No se encontró cámara.";
        }
    } catch (err) {
        console.error(err);
        mensaje.innerHTML = "❌ Error de permisos de cámara.";
        alert("Asegúrate de dar permisos de cámara y usar HTTPS");
    }
};

// --- GUARDAR INGRESO EN FIREBASE ---
window.guardarFoto = async function() {
    if (!datosVisita) {
        alert("Primero debes escanear un código QR válido");
        return;
    }

    let archivo = document.getElementById("fotoCaseta").files[0];
    if (!archivo) {
        alert("Debes tomar una foto de evidencia (auto/persona)");
        return;
    }

    try {
        document.getElementById("resultado").innerHTML = "⏳ Guardando registro...";
        
        // 1. Subir foto de evidencia a Storage
        let storageRef = ref(storage, "ingresos/" + Date.now() + "_" + datosVisita.casa);
        await uploadBytes(storageRef, archivo);
        let urlEvidencia = await getDownloadURL(storageRef);

        // 2. Guardar datos en Firestore
        await addDoc(collection(db, "registroAccesos"), {
            nombre: datosVisita.nombre,
            casa: datosVisita.casa,
            tipo: datosVisita.tipo,
            autoriza: datosVisita.autoriza || "N/A",
            fecha: Date.now(),
            fotoEvidencia: urlEvidencia
        });

        alert("Registro completado con éxito");
        location.reload(); // Reiniciar para el siguiente

    } catch (error) {
        console.error("Error al guardar:", error);
        alert("Error al conectar con la base de datos");
    }
};
