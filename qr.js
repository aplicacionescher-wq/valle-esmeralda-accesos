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

        // GUARDAMOS CON ESTADO PENDIENTE
        const docRef = await addDoc(collection(db, "visitas"), {
            nombre: nombre,
            tipo: document.getElementById("tipo").value,
            casa: localStorage.getItem("casa") || "S/N",
            autoriza: localStorage.getItem("usuario") || "Residente",
            estado: "pendiente", 
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
        btnGen.innerText = "✨ Generar Otro Código";
        btnGen.disabled = false;

    } catch (err) {
        btnGen.disabled = false;
        btnGen.innerText = "✨ Generar Código QR";
        alert("Error: " + err.message);
    }
};

window.enviarWhats = async function() {
    const btn = document.getElementById("btnWhats");
    const qrDiv = document.getElementById("qr");
    
    try {
        btn.innerText = "⏳ Preparando...";
        const canvas = await html2canvas(qrDiv, { backgroundColor: "#ffffff", scale: 2 });
        
        canvas.toBlob(async (blob) => {
            const file = new File([blob], "Pase_Valle.png", { type: "image/png" });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: 'Pase de Acceso' });
            } else {
                const link = `${window.location.origin}/verqr.html?id=${window.currentQrID}`;
                window.open(`https://wa.me/?text=${encodeURIComponent("Pase de acceso: " + link)}`);
            }
            btn.innerText = "📱 Enviar por WhatsApp";
        }, "image/png");
    } catch (err) {
        btn.innerText = "📱 Enviar por WhatsApp";
        alert("Error: " + err.message);
    }
};
