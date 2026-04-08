import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.crearQR = async function() {
    const nombre = document.getElementById("nombre").value.trim();
    const qrDiv = document.getElementById("qr");
    const btnGen = document.getElementById("btnGen");

    if (!nombre) return alert("Escribe el nombre del invitado");

    if (typeof QRCode === "undefined") {
        return alert("❌ ERROR: La librería qrcode.min.js no se cargó.");
    }

    try {
        btnGen.disabled = true;
        btnGen.innerText = "⏳ Guardando...";

        // 🔥 AQUÍ ESTÁ LA CORRECCIÓN CLAVE
        const docRef = await addDoc(collection(db, "visitas"), {
            nombre: nombre,
            tipo: document.getElementById("tipo").value,
            casa: localStorage.getItem("casa") || "S/N",
            autoriza: localStorage.getItem("usuario") || "Residente",

            // 🔥 CAMPOS QUE FALTABAN
            estado: "pendiente",
            fecha: new Date().toLocaleString(),
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

// 🔥 WHATSAPP (LO DEJO IGUAL PORQUE YA TE FUNCIONA)
window.enviarWhats = async function() {
    const qrDiv = document.getElementById("qr");
    const btn = document.getElementById("btnWhats");

    if (typeof html2canvas === "undefined") {
        return alert("❌ ERROR: Falta html2canvas.min.js");
    }

    try {
        btn.innerText = "⏳ Creando Imagen...";

        const canvas = await html2canvas(qrDiv, {
            backgroundColor: "#ffffff",
            scale: 2,
            useCORS: true
        });

        canvas.toBlob(async (blob) => {
            if (!blob) return alert("No se pudo crear la imagen");

            const file = new File([blob], "Pase_Valle.png", { type: "image/png" });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'Pase de Acceso'
                    });
                } catch (err) {}
            } else {
                const link = `${window.location.origin}/verqr.html?id=${window.currentQrID}`;
                window.open(`https://wa.me/?text=${encodeURIComponent("Usa este acceso: " + link)}`);
            }

            btn.innerText = "📱 Enviar por WhatsApp";

        }, "image/png");

    } catch (err) {
        btn.innerText = "📱 Enviar por WhatsApp";
        alert("Error técnico: " + err.message);
    }
};
