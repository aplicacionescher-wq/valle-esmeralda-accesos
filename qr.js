import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.crearQR = async function() {
    const nombre = document.getElementById("nombre").value.trim();
    const qrDiv = document.getElementById("qr");
    const btnGen = document.getElementById("btnGen");

    if (!nombre) return alert("Escribe el nombre del invitado");

    // VALIDACIÓN DE LIBRERÍA 1
    if (typeof QRCode === "undefined") {
        return alert("❌ ERROR: La librería qrcode.min.js no se cargó. Revisa que el archivo esté en la carpeta public.");
    }

    try {
        btnGen.disabled = true;
        btnGen.innerText = "⏳ Guardando...";

        const docRef = await addDoc(collection(db, "visitas"), {
            nombre: nombre,
            tipo: document.getElementById("tipo").value,
            casa: localStorage.getItem("casa") || "S/N",
            autoriza: localStorage.getItem("usuario") || "Residente",
            timestamp: Date.now()
        });

        window.currentQrID = docRef.id;
        const linkPase = `${window.location.origin}/verqr.html?id=${docRef.id}`;

        qrDiv.innerHTML = ""; 
        new QRCode(qrDiv, {
            text: linkPase,
            width: 300,
            height: 300,
            correctLevel: QRCode.CorrectLevel.H
        });

        document.getElementById("qr-container").style.display = "block";
        document.getElementById("btnWhats").style.display = "block";
        btnGen.disabled = false;
        btnGen.innerText = "✨ Generar Nuevo";

    } catch (e) {
        alert("Error Firebase: " + e.message);
        btnGen.disabled = false;
    }
};

window.enviarWhats = async function() {
    const qrDiv = document.getElementById("qr");
    const btn = document.getElementById("btnWhats");

    // VALIDACIÓN DE LIBRERÍA 2
    if (typeof html2canvas === "undefined") {
        return alert("❌ ERROR: La librería html2canvas.min.js no se encuentra. El envío de imagen no funcionará.");
    }

    try {
        btn.innerText = "⏳ Creando Imagen...";
        
        // Captura el QR con fondo blanco forzado
        const canvas = await html2canvas(qrDiv, { 
            backgroundColor: "#ffffff",
            scale: 2,
            useCORS: true // Importante para evitar bloqueos de seguridad
        });
        
        canvas.toBlob(async (blob) => {
            if (!blob) return alert("No se pudo crear la imagen");

            const file = new File([blob], "Pase_Valle.png", { type: "image/png" });

            // WEB SHARE API: Esto solo funciona en móviles con HTTPS
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'Pase de Acceso'
                    });
                } catch (err) {
                    console.log("Compartir cancelado");
                }
            } else {
                // RESPALDO SI NO ES MÓVIL O NO SOPORTA IMAGEN
                alert("Tu dispositivo no permite enviar imágenes directamente. Enviando link...");
                const link = `${window.location.origin}/verqr.html?id=${window.currentQrID}`;
                window.open(`https://wa.me/?text=${encodeURIComponent("Usa este link para tu acceso: " + link)}`);
            }
            btn.innerText = "📱 Enviar por WhatsApp";
        }, "image/png");

    } catch (err) {
        btn.innerText = "📱 Enviar por WhatsApp";
        alert("Error técnico: " + err.message);
    }
};
