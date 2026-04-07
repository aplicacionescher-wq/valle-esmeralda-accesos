import { db } from "./firebase.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.onScanSuccess = async function(decodedText) {
    const resDiv = document.getElementById("resultado");
    
    // Extraer ID (limpia el link si viene completo)
    let idDoc = decodedText;
    if (decodedText.includes("id=")) {
        idDoc = new URLSearchParams(decodedText.split('?')[1]).get("id");
    }

    try {
        const docRef = doc(db, "visitas", idDoc);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
            mostrarResultado("❌ CÓDIGO INVÁLIDO", "Este pase no existe en la base de datos.", "#ef4444");
            return;
        }

        const data = snap.data();
        const ahora = Date.now();
        const limite = 24 * 60 * 60 * 1000; // 24h

        // 1. Validar si ya se usó
        if (data.estado === "usado") {
            mostrarResultado("⚠️ ACCESO DENEGADO", `Este pase ya fue utilizado anteriormente.`, "#f59e0b");
        } 
        // 2. Validar si expiró
        else if ((ahora - data.timestamp) > limite) {
            await updateDoc(docRef, { estado: "expirado" });
            mostrarResultado("⏰ PASE EXPIRADO", "El tiempo de validez (24h) ha terminado.", "#ef4444");
        } 
        // 3. ACCESO CORRECTO
        else {
            await updateDoc(docRef, { 
                estado: "usado", 
                fechaEntrada: ahora 
            });
            
            resDiv.style.backgroundColor = "#064e3b";
            resDiv.style.border = "2px solid #22c55e";
            resDiv.innerHTML = `
                <h2 style="color:#22c55e; margin:0;">✅ ACCESO CORRECTO</h2>
                <p style="margin:10px 0;"><b>Invitado:</b> ${data.nombre}<br>
                <b>Casa:</b> ${data.casa}<br>
                <b>Tipo:</b> ${data.tipo.toUpperCase()}</p>
                <small>Entrada registrada con éxito</small>
            `;
            if(navigator.vibrate) navigator.vibrate([100, 50, 100]);
        }
    } catch (e) {
        mostrarResultado("⚠️ ERROR DE RED", "No se pudo conectar con Firebase.", "#334155");
    }
};

function mostrarResultado(titulo, msg, color) {
    const resDiv = document.getElementById("resultado");
    resDiv.style.backgroundColor = "#1e293b";
    resDiv.style.border = `2px solid ${color}`;
    resDiv.innerHTML = `<h2 style="color:${color}; margin:0;">${titulo}</h2><p>${msg}</p>`;
    if(navigator.vibrate) navigator.vibrate(500);
}
