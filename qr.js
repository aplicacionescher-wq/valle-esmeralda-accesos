import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.crearQR = async function() {
    const nombre = document.getElementById("nombre").value.trim();
    const qrDiv = document.getElementById("qr");
    const btnGen = document.getElementById("btnGen");
    const loader = document.getElementById("loader");

    if (!nombre) return alert("Escribe el nombre del invitado");

    if (typeof QRCode === "undefined") {
        return alert("❌ ERROR: La librería qrcode.min.js no se cargó.");
    }

    try {
        btnGen.disabled = true;
        loader.style.display = "block";

        // GUARDADO COMPLETO EN FIREBASE
        const docRef = await addDoc(collection(db, "visitas"), {
            nombre: nombre,
            tipo: document.getElementById("tipo").value,
            casa: localStorage.getItem("casa") || "S/N",
            autoriza: localStorage.getItem("usuario") || "Residente",
            estado: "pendiente", // Clave para que aparezca en pendientes.html
            timestamp: Date.now()
        });

        window.currentQrID = docRef.id;
        const linkPase = `${window.location.origin}/verqr.html?id=${docRef.id}`;

        // GENERACIÓN VISUAL DEL QR
        qrDiv.innerHTML = ""; 
        new QRCode(qrDiv, {
            text: linkPase,
            width: 300,
            height: 300,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });

        document.getElementById("qr-container").style.display = "block";
        document.getElementById("btnWhats").style.display = "block";
        btnGen.innerText = "✨ Generar Otro Código";
        btnGen.disabled = false;
        loader.style.display = "none";

    } catch (err) {
        btnGen.disabled = false;
        loader.style.display = "none";
        alert("Error: " + err.message);
    }
};

window.enviarWhats = async function() {
    const btn = document.getElementById("btnWhats");
    const qrDiv = document.getElementById("qr");
    
    try {
        btn.innerText = "⏳ Preparando...";
        const canvas = await html2canvas(qrDiv, { 
            backgroundColor: "#ffffff",
            scale: 2,
            useCORS: true 
        });
        
        canvas.toBlob(async (blob) => {
            const file = new File([blob], "Pase_Valle.png", { type: "image/png" });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ files: [file], title: 'Pase de Acceso Valle Esmeralda' });
            } else {
                const link = `${window.location.origin}/verqr.html?id=${window.currentQrID}`;
                window.open(`https://wa.me/?text=${encodeURIComponent("Usa este link para tu acceso: " + link)}`);
            }
            btn.innerText = "📱 Enviar por WhatsApp";
        }, "image/png");
    } catch (err) {
        btn.innerText = "📱 Enviar por WhatsApp";
        alert("Error: " + err.message);
    }
};
