import { db } from "./firebase.js";
import { doc, getDoc, updateDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.onScanSuccess = async function(decodedText) {
    const resDiv = document.getElementById("resultado");
    let idDoc = decodedText;

    // Limpiar el ID si viene dentro de una URL
    if (decodedText.includes("id=")) {
        const urlParams = new URLSearchParams(decodedText.split('?')[1]);
        idDoc = urlParams.get("id");
    }

    try {
        const docRef = doc(db, "visitas", idDoc);
        const snap = await getDoc(docRef);

        if (!snap.exists()) {
            registrarEnHistorial("Desconocido", "N/A", "DENEGADO", "Código inexistente");
            mostrarResultado("❌ CÓDIGO INVÁLIDO", "Este pase no existe.", "#ef4444");
            return;
        }

        const data = snap.data();
        const ahora = Date.now();
        const limite = 24 * 60 * 60 * 1000; // 24 horas

        // Caso 1: YA USADO
        if (data.estado === "usado") {
            registrarEnHistorial(data.nombre, data.casa, "DENEGADO", "QR ya utilizado");
            mostrarResultado("⚠️ ACCESO DENEGADO", "Este pase ya fue utilizado anteriormente.", "#f59e0b");
        } 
        // Caso 2: EXPIRADO
        else if ((ahora - data.timestamp) > limite) {
            await updateDoc(docRef, { estado: "expirado" });
            registrarEnHistorial(data.nombre, data.casa, "DENEGADO", "QR expirado (24h)");
            mostrarResultado("⏰ PASE EXPIRADO", "El tiempo de validez ha terminado.", "#ef4444");
        } 
        // Caso 3: ACCESO CORRECTO
        else {
            // Actualizamos el estado del pase original
            await updateDoc(docRef, { 
                estado: "usado", 
                fechaEntrada: ahora 
            });

            // Registramos el éxito en el historial
            registrarEnHistorial(data.nombre, data.casa, "PERMITIDO", `Acceso tipo: ${data.tipo}`);
            
            resDiv.style.backgroundColor = "#064e3b";
            resDiv.style.border = "2px solid #22c55e";
            resDiv.style.display = "block";
            resDiv.innerHTML = `
                <h2 style="color:#22c55e; margin:0;">✅ ACCESO CORRECTO</h2>
                <div style="text-align:left; margin-top:10px;">
                    <p><b>Invitado:</b> ${data.nombre}</p>
                    <p><b>Casa:</b> ${data.casa}</p>
                    <p><b>Tipo:</b> ${data.tipo.toUpperCase()}</p>
                </div>
            `;
            if(navigator.vibrate) navigator.vibrate([100, 50, 100]);
        }
    } catch (e) {
        console.error(e);
        mostrarResultado("⚠️ ERROR", "No hay conexión con el servidor.", "#334155");
    }
};

// FUNCIÓN PARA ESCRIBIR EN EL HISTORIAL GENERAL
async function registrarEnHistorial(nombre, casa, resultado, motivo) {
    try {
        await addDoc(collection(db, "historial_accesos"), {
            nombre: nombre,
            casa: casa,
            resultado: resultado, // PERMITIDO o DENEGADO
            motivo: motivo,
            timestamp: Date.now(),
            guardia: localStorage.getItem("usuario") || "Caseta"
        });
    } catch (error) {
        console.error("No se pudo guardar el historial:", error);
    }
}

function mostrarResultado(titulo, msg, color) {
    const resDiv = document.getElementById("resultado");
    resDiv.style.display = "block";
    resDiv.style.backgroundColor = "#1e293b";
    resDiv.style.border = `2px solid ${color}`;
    resDiv.innerHTML = `<h2 style="color:${color}; margin:0;">${titulo}</h2><p>${msg}</p>`;
    if(navigator.vibrate) navigator.vibrate(500);
}
