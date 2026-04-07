import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.crearQR = async function() {
    // 1. Obtener elementos
    const nombreInput = document.getElementById("nombre");
    const tipoInput = document.getElementById("tipo");
    const qrDiv = document.getElementById("qr");

    // 2. Validaciones básicas
    if (!nombreInput.value) {
        alert("Por favor, ingresa el nombre del invitado");
        return;
    }

    // 3. Obtener datos de sesión (asegúrate de que el login funcione)
    const casa = localStorage.getItem("casa") || "Sin Casa";
    const autoriza = localStorage.getItem("usuario") || "Residente";

    try {
        console.log("Intentando guardar en Firebase...");
        
        // 4. Guardar en la colección 'visitas' (Capa gratuita)
        const docRef = await addDoc(collection(db, "visitas"), {
            nombre: nombreInput.value,
            tipo: tipoInput.value,
            casa: casa,
            autoriza: autoriza,
            timestamp: Date.now()
        });

        const qrID = docRef.id;
        window.currentQrID = qrID; // Para usar en WhatsApp después

        // 5. Limpiar el contenedor del QR
        qrDiv.innerHTML = "";

        // 6. Generar el QR (Link para el invitado)
        const linkPase = `https://valle-esmeralda-accesos.web.app/verqr.html?id=${qrID}`;
        
        // Esta es la parte que suele fallar en PC si la librería no carga
        if (typeof QRCode !== "undefined") {
            new QRCode(qrDiv, {
                text: linkPase,
                width: 200,
                height: 200,
                colorDark : "#000000",
                colorLight : "#ffffff"
            });
            alert("✅ ¡Pase generado con éxito!");
        } else {
            console.error("La librería QRCode no está cargada");
            alert("Error: No se pudo cargar el generador de imágenes. Recarga la página.");
        }

    } catch (e) {
        console.error("Error completo:", e);
        alert("Error al conectar con Firebase: " + e.message);
    }
};
