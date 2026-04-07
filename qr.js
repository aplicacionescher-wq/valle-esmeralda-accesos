import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.crearQR = async function() {
    const nombre = document.getElementById("nombre").value.trim();
    const tipo = document.getElementById("tipo").value;
    const qrDiv = document.getElementById("qr");
    const btnGen = document.getElementById("btnGen");

    if (!nombre) return alert("Ingresa el nombre del invitado");

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

        window.currentQrID = docRef.id;
        const linkPase = `${window.location.origin}/verqr.html?id=${docRef.id}`;

        // 2. Generar QR de ALTA RESOLUCIÓN (Para que el guardia escanee a la primera)
        qrDiv.innerHTML = ""; 
        new QRCode(qrDiv, {
            text: linkPase,
            width: 400, // Aumentamos tamaño base
            height: 400,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H // Máxima corrección de errores
        });

        document.getElementById("qr-container").style.display = "block";
        document.getElementById("btnWhats").style.display = "block";
        btnGen.disabled = false;
        btnGen.innerText = "✨ Generar Nuevo";

    } catch (e) {
        alert("Error de conexión");
        btnGen.disabled = false;
    }
};

window.enviarWhats = async function() {
    const qrDiv = document.getElementById("qr");
    const btn = document.getElementById("btnWhats");

    try {
        btn.innerText = "⏳ Procesando...";
        
        // CAPTURA DE ALTA CALIDAD
        const canvas = await html2canvas(qrDiv, { 
            backgroundColor: "#ffffff",
            scale: 2, // Duplica la densidad de píxeles
            logging: false
        });
        
        canvas.toBlob(async (blob) => {
            const file = new File([blob], "Pase_Valle.png", { type: "image/png" });

            // Intento de envío de imagen nativa (Solo Móvil)
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'Pase de Acceso'
                    });
                } catch (err) {
                    console.log("Cancelado");
                }
            } else {
                // RESPALDO: Si falla la imagen, envía el link (PC o móviles viejos)
                const link = `${window.location.origin}/verqr.html?id=${window.currentQrID}`;
                window.open(`https://wa.me/?text=${encodeURIComponent("Usa este link para tu acceso: " + link)}`);
            }
            btn.innerText = "📱 Enviar por WhatsApp";
        }, "image/png");

    } catch (err) {
        btn.innerText = "📱 Enviar por WhatsApp";
        alert("Error al compartir. Intenta de nuevo.");
    }
};
