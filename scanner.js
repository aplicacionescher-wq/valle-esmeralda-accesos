import { db } from "./firebase.js";
import { 
    doc, 
    getDoc, 
    updateDoc, 
    collection, 
    addDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Función principal que se activa al detectar un QR
window.onScanSuccess = async function(decodedText) {
    const resDiv = document.getElementById("resultado");
    let idDoc = decodedText;

    // 1. Limpiar el ID si viene dentro de una URL (ej. de verqr.html?id=...)
    if (decodedText.includes("id=")) {
        const urlParams = new URLSearchParams(decodedText.split('?')[1]);
        idDoc = urlParams.get("id");
    }

    try {
        const docRef = doc(db, "visitas", idDoc);
        const snap = await getDoc(docRef);

        // 2. Validar si el documento existe en Firebase
        if (!snap.exists()) {
            await registrarEnHistorial("Desconocido", "N/A", "DENEGADO", "Código inexistente");
            mostrarResultado("❌ CÓDIGO INVÁLIDO", "Este pase no existe o es de otra privada.", "#ef4444");
            return;
        }

        const data = snap.data();
        const ahora = Date.now();
        const limite = 12 * 60 * 60 * 1000; // 24 horas de validez

        // CASO A: El pase ya fue usado
        if (data.estado === "usado") {
            await registrarEnHistorial(data.nombre, data.casa, "DENEGADO", "QR ya utilizado");
            mostrarResultado("⚠️ ACCESO DENEGADO", "Este pase ya fue utilizado anteriormente.", "#f59e0b");
        } 
        
        // CASO B: El pase expiró (más de 12 horas)
        else if (data.timestamp && (ahora - data.timestamp) > limite) {
            await updateDoc(docRef, { estado: "expirado" });
            await registrarEnHistorial(data.nombre, data.casa, "DENEGADO", "QR expirado (12h)");
            mostrarResultado("⏰ PASE EXPIRADO", "El tiempo de validez de 12 horas ha terminado.", "#ef4444");
        } 
        
        // CASO C: ACCESO CORRECTO
        else {
            // Marcamos como usado en la base de datos
            await updateDoc(docRef, { 
                estado: "usado", 
                fechaEntrada: ahora 
            });

            // Guardamos en el historial de auditoría
            await registrarEnHistorial(data.nombre, data.casa, "PERMITIDO", `Acceso tipo: ${data.tipo}`);
            
            // Mostramos el recuadro verde de éxito con los datos
            resDiv.style.backgroundColor = "#064e3b";
            resDiv.style.border = "2px solid #22c55e";
            resDiv.style.display = "block";
            resDiv.innerHTML = `
                <h2 style="color:#22c55e; margin:0;">✅ ACCESO CORRECTO</h2>
                <div style="text-align:left; margin-top:15px; border-top:1px solid #22c55e; padding-top:10px;">
                    <p style="margin:5px 0;"><b>Invitado:</b> ${data.nombre}</p>
                    <p style="margin:5px 0;"><b>Casa:</b> ${data.casa}</p>
                    <p style="margin:5px 0;"><b>Tipo:</b> ${data.tipo.toUpperCase()}</p>
                    <p style="margin:5px 0;"><b>Autoriza:</b> ${data.autoriza || 'Residente'}</p>
                </div>
            `;

            // Vibración triple de éxito
            if(navigator.vibrate) navigator.vibrate([100, 50, 100]);
        }
    } catch (e) {
        console.error("Error en escaneo:", e);
        mostrarResultado("⚠️ ERROR", "Error de red o base de datos. Intente de nuevo.", "#334155");
    }
};

// Función para registrar todos los intentos en la colección 'historial_accesos'
async function registrarEnHistorial(nombre, casa, resultado, motivo) {
    try {
        await addDoc(collection(db, "historial_accesos"), {
            nombre: nombre,
            casa: casa,
            resultado: resultado, // PERMITIDO o DENEGADO
            motivo: motivo,
            timestamp: Date.now(),
            guardia: localStorage.getItem("usuario") || "Caseta Principal"
        });
    } catch (error) {
        console.error("No se pudo guardar el historial:", error);
    }
}

// Función auxiliar para mostrar alertas visuales en el cuadro de resultado
function mostrarResultado(titulo, msg, color) {
    const resDiv = document.getElementById("resultado");
    resDiv.style.display = "block";
    resDiv.style.backgroundColor = "#1e293b";
    resDiv.style.border = `2px solid ${color}`;
    resDiv.innerHTML = `
        <h2 style="color:${color}; margin:0;">${titulo}</h2>
        <p style="margin-top:10px; color:#cbd5e1;">${msg}</p>
    `;
    
    // Vibración larga de error/advertencia
    if(navigator.vibrate) navigator.vibrate(500);
}
