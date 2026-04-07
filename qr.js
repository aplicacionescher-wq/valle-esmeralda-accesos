Para que tu sistema funcione al 100% (evitando bloqueos de rastreo, permitiendo la descarga de imágenes y asegurando que el guardia en caseta pueda leer los datos asociados), aquí tienes el código completo de qr.js y sw.js.

1. qr.js (Lógica de Generación y Sincronización)
Este archivo maneja la creación del registro en Firebase y dibuja el código QR en la pantalla del residente. Se encarga de que el QR contenga el enlace correcto para que el guardia lo escanee.

JavaScript
import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * Función global para crear el registro en Firestore y generar el QR físico.
 */
window.crearQR = async function() {
    const nombreInput = document.getElementById("nombre");
    const tipoInput = document.getElementById("tipo");
    const qrContainer = document.getElementById("qr-container");
    const qrDiv = document.getElementById("qr");
    const btnGen = document.getElementById("btnGen");
    const btnWhats = document.getElementById("btnWhats");
    const loading = document.getElementById("loading");

    // Validar que el nombre no esté vacío
    if (!nombreInput.value.trim()) {
        alert("Por favor, ingresa el nombre del invitado.");
        return;
    }

    // Verificar si la librería local qrcode.min.js cargó correctamente
    if (typeof QRCode === "undefined") {
        alert("Error: La librería de generación de QR no está disponible. Revisa que qrcode.min.js esté en tu carpeta public.");
        return;
    }

    try {
        // Interfaz: Bloquear botón y mostrar carga
        btnGen.disabled = true;
        if (loading) loading.style.display = "block";
        qrContainer.style.display = "none";

        // 1. Guardar datos en la colección 'visitas' de Firebase
        // Usamos los datos de sesión guardados en el login
        const docRef = await addDoc(collection(db, "visitas"), {
            nombre: nombreInput.value.trim(),
            tipo: tipoInput.value,
            casa: localStorage.getItem("casa") || "Sin Casa",
            autoriza: localStorage.getItem("usuario") || "Residente",
            timestamp: Date.now(),
            estado: "pendiente"
        });

        // 2. Guardar el ID generado para el botón de WhatsApp
        window.currentQrID = docRef.id;

        // 3. Crear el Link que el invitado mostrará al guardia
        // IMPORTANTE: Este link contiene el ID que el scanner de caseta buscará
        const linkPase = `https://valle-esmeralda-accesos.web.app/verqr.html?id=${docRef.id}`;

        // 4. Limpiar y Dibujar el QR en el HTML
        qrDiv.innerHTML = ""; // Limpiar contenido previo
        new QRCode(qrDiv, {
            text: linkPase,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H // Nivel alto para lectura fácil en pantallas
        });

        // 5. Actualizar Interfaz
        if (loading) loading.style.display = "none";
        qrContainer.style.display = "block";
        if (btnWhats) btnWhats.style.display = "block";
        btnGen.disabled = false;
        btnGen.innerText = "🔄 Generar Nuevo Pase";

        console.log("Éxito: Pase generado con ID " + docRef.id);

    } catch (error) {
        console.error("Error en Firebase:", error);
        alert("Error de conexión con la base de datos. Verifica tu internet.");
        btnGen.disabled = false;
        if (loading) loading.style.display = "none";
    }
};

/**
 * Función para abrir WhatsApp con el mensaje preconfigurado y el link.
 */
window.enviarWhats = function() {
    if (!window.currentQrID) {
        alert("Primero debes generar el código QR.");
        return;
    }

    const telInput = document.getElementById("telefono");
    const telefono = telInput ? telInput.value.trim() : "";
    
    if (telefono.length < 10) {
        alert("Por favor, ingresa un número de WhatsApp válido a 10 dígitos.");
        return;
    }

    const link = `https://valle-esmeralda-accesos.web.app/verqr.html?id=${window.currentQrID}`;
    const mensaje = encodeURIComponent(`¡Hola! Este es tu pase de acceso para Valle Esmeralda. Presiona el siguiente link para mostrarlo en caseta al llegar: ${link}`);
    
    // Abrir WhatsApp con el código de país de México (52)
    window.open(`https://wa.me/52${telefono}?text=${mensaje}`, '_blank');
};
