import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.crearQR = async function() {
    const nombre = document.getElementById("nombre").value.trim();
    const tipo = document.getElementById("tipo").value;
    const qrDiv = document.getElementById("qr");
    const btnGen = document.getElementById("btnGen");

    if (!nombre) return alert("Por favor, ingresa el nombre del invitado.");

    try {
        btnGen.disabled = true;
        btnGen.innerText = "⏳ Guardando...";

        // 1. Guardar en Firebase
        const docRef = await addDoc(collection(db, "visitas"), {
            nombre: nombre,
            tipo: tipo,
            casa: localStorage.getItem("casa") || "S/N",
            autoriza: localStorage.getItem("usuario") || "Residente",
            timestamp: Date.now()
        });

        // Guardamos el ID para enviarlo por WhatsApp después
        window.currentQrID = docRef.id;

        // 2. Crear el LINK COMPLETO que el invitado abrirá
        // IMPORTANTE: Asegúrate de que esta URL coincida con tu dominio de Firebase
        const urlBase = window.location.origin; // Detecta automáticamente si es localhost o tu dominio real
        const linkPase = `${urlBase}/verqr.html?id=${docRef.id}`;

        // 3. Generar el QR visual
        qrDiv.innerHTML = ""; 
        new QRCode(qrDiv, {
            text: linkPase,
            width: 250,
            height: 250,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        document.getElementById("qr-container").style.display = "block";
        document.getElementById("btnWhats").style.display = "block";
        btnGen.disabled = false;
        btnGen.innerText = "✨ Generar Nuevo";

        console.log("Pase generado con ID:", docRef.id);

    } catch (e) {
        console.error("Error Firebase:", e);
        alert("Error de conexión. Revisa tu internet.");
        btnGen.disabled = false;
    }
};

window.enviarWhats = async function() {
    const qrDiv = document.getElementById("qr");
    const btn = document.getElementById("btnWhats");

    try {
        btn.innerText = "⏳ Procesando Imagen...";
        
        // Capturamos el QR (que ya tiene el link embebido) como imagen
        const canvas = await html2canvas(qrDiv, { 
            backgroundColor: "#ffffff",
            scale: 3 
        });
        
        canvas.toBlob(async (blob) => {
            const file = new File([blob], "Pase_Valle.png", { type: "image/png" });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file] });
            } else {
                // Si no puede compartir imagen, envía el LINK como texto (Respaldo)
                const link = `${window.location.origin}/verqr.html?id=${window.currentQrID}`;
                window.open(`https://wa.me/?text=${encodeURIComponent("Usa este link para tu acceso: " + link)}`);
            }
            btn.innerText = "📱 Enviar por WhatsApp";
        }, "image/png");

    } catch (err) {
        btn.innerText = "📱 Enviar por WhatsApp";
        alert("Error al compartir.");
    }
};
