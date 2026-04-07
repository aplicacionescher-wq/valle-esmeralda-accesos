import { db, storage } from "./firebase.js";
import { doc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

let datosVisitaActual = null;
let html5QrCode = null;

// --- FUNCIÓN QUE SE EJECUTA AL LEER EL QR ---
async function onScanSuccess(decodedText) {
    const resultadoDiv = document.getElementById("resultado");
    let idParaBuscar = "";

    try {
        // 1. EXTRAER EL ID (Ya sea que lea el link o el ID directo)
        if (decodedText.includes("id=")) {
            const urlParams = new URLSearchParams(decodedText.split('?')[1]);
            idParaBuscar = urlParams.get("id");
        } else {
            idParaBuscar = decodedText; // Por si el QR solo tiene el ID
        }

        if (!idParaBuscar) throw new Error("ID no encontrado en el QR");

        resultadoDiv.innerHTML = "🔍 Buscando en Firebase...";

        // 2. BUSCAR EN FIREBASE ASOCIADO AL ID
        const docRef = doc(db, "visitas", idParaBuscar);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            datosVisitaActual = { id: idParaBuscar, ...docSnap.data() };
            
            // 3. MOSTRAR INFORMACIÓN AL GUARDIA
            resultadoDiv.innerHTML = `
                <div style="background: #14532d; padding: 10px; border-radius: 8px; border: 2px solid #22c55e;">
                    <h3 style="margin:0; color:#22c55e;">✅ ACCESO VÁLIDO</h3>
                    <p><b>Invitado:</b> ${datosVisitaActual.nombre}</p>
                    <p><b>Casa:</b> ${datosVisitaActual.casa}</p>
                    <p><b>Tipo:</b> ${datosVisitaActual.tipo.toUpperCase()}</p>
                </div>
            `;
            
            if(html5QrCode) html5QrCode.stop(); // Detener cámara tras éxito
        } else {
            resultadoDiv.innerHTML = `<h3 style="color:#ef4444;">❌ NO ENCONTRADO</h3>
                                      <p>El código no existe en la base de datos.</p>`;
        }
    } catch (err) {
        resultadoDiv.innerHTML = "⚠️ Error al procesar QR.";
        console.error(err);
    }
}

// --- ACTIVAR CÁMARA ---
window.activarCamara = async function() {
    if (!html5QrCode) html5QrCode = new Html5Qrcode("reader");
    
    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        onScanSuccess
    ).catch(err => alert("Error de cámara: " + err));
};

// --- GUARDAR EVIDENCIA (BOTÓN REGISTRAR) ---
window.guardarFoto = async function() {
    if (!datosVisitaActual) return alert("Escanea un QR válido primero");
    
    const file = document.getElementById("fotoCaseta").files[0];
    if (!file) return alert("Toma la foto de evidencia");

    try {
        document.getElementById("resultado").innerHTML = "⏳ Guardando registro...";
        
        // Subir a Storage
        const storageRef = ref(storage, `evidencias/${Date.now()}_${datosVisitaActual.casa}`);
        await uploadBytes(storageRef, file);
        const urlFoto = await getDownloadURL(storageRef);

        // Guardar en colección 'accesos'
        await addDoc(collection(db, "accesos"), {
            visitaId: datosVisitaActual.id,
            nombre: datosVisitaActual.nombre,
            casa: datosVisitaActual.casa,
            fotoEvidencia: urlFoto,
            fechaIngreso: new Date().toLocaleString(),
            guardia: localStorage.getItem("usuario") || "Caseta"
        });

        alert("✅ Ingreso registrado correctamente");
        location.reload();
    } catch (e) {
        alert("Error al guardar");
        console.error(e);
    }
};
