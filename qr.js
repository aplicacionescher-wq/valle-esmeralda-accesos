import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. GENERAR EL PASE Y EL QR
window.crearQR = async function() {
    const nombre = document.getElementById("nombre").value.trim();
    const tipo = document.getElementById("tipo").value;
    const qrDiv = document.getElementById("qr");
    const btnGen = document.getElementById("btnGen");

    if (!nombre) return alert("Por favor, ingresa el nombre del invitado.");

    try {
        btnGen.disabled = true;
        btnGen.innerText = "⏳ Guardando...";

        // Guardar en Firebase
        const docRef = await addDoc(collection(db, "visitas"), {
            nombre: nombre,
            tipo: tipo,
            casa: localStorage.getItem("casa") || "S/N",
            autoriza: localStorage.getItem("usuario") || "Residente",
            timestamp: Date.now()
        });

        window.currentQrID = docRef.id;
        const linkPase = `${window.location.origin}/verqr.html?id=${docRef.id}`;

        // Generar QR con alta resolución y corrección de errores
        qrDiv.innerHTML = ""; 
        new QRCode(qrDiv, {
            text: linkPase,
            width: 350,
            height: 350,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        document.getElementById("qr-container").style.display = "block";
        document.getElementById("btnWhats").style.display = "block";
        btnGen.disabled = false;
        btnGen.innerText = "✨ Generar Nuevo";

    } catch (e) {
        console.error(e);
        alert("Error al conectar con Firebase.");
        btnGen.disabled = false;
    }
};

// 2. ENVIAR LA IMAGEN POR WHATSAPP
window.enviarWhats = async function() {
    const qrDiv = document.getElementById("qr");
    const btn = document.getElementById("btnWhats");

    try {
        btn.innerText = "⏳ Procesando Imagen...";
        
        // Creamos la captura del QR
        const canvas = await html2canvas(qrDiv, { 
            backgroundColor: "#ffffff", // Obligatorio para visibilidad
            scale: 2 
        });
        
        canvas.toBlob(async (blob) => {
            const file = new File([blob], "Pase_Valle.png", { type: "image/png" });

            // Usamos la API de compartir del celular
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'Pase de Acceso Valle Esmeralda',
                        text: 'Presenta esta imagen en la entrada.'
                    });
                } catch (err) {
                    console.log("Envío cancelado por el usuario.");
                }
            } else {
                // Si el navegador no permite enviar archivos (como en PC), enviamos el link
                const link = `${window.location.origin}/verqr.html?id=${window.currentQrID}`;
                const msg = encodeURIComponent(`Hola, este es tu pase: ${link}`);
                window.open(`https://wa.me/?text=${msg}`);
            }
            btn.innerText = "📱 Enviar por WhatsApp";
        }, "image/png");

    } catch (err) {
        btn.innerText = "📱 Enviar por WhatsApp";
        alert("Hubo un error al generar la imagen.");
    }
};
