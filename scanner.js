import { db } from "./firebase.js";
import { doc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function onScanSuccess(textoEscaneado) {
    let idParaBuscar = "";

    // Si lo que leyó es un link completo, extraemos solo el ID
    if (textoEscaneado.includes("id=")) {
        const urlObj = new URL(textoEscaneado);
        idParaBuscar = urlObj.searchParams.get("id");
    } else {
        idParaBuscar = textoEscaneado; // Asumimos que leyó el ID directo
    }

    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = "🔍 Buscando ID: " + idParaBuscar;

    try {
        // Buscamos en "visitas"
        const docRef = doc(db, "visitas", idParaBuscar);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const visita = docSnap.data();
            // Guardamos globalmente para usarlo al registrar la entrada
            window.datosVisitaActual = visita; 

            resultadoDiv.innerHTML = `
                <h2 style="color:lime">✅ ENCONTRADO</h2>
                <b>Invitado:</b> ${visita.nombre}<br>
                <b>Casa:</b> ${visita.casa}
            `;
        } else {
            resultadoDiv.innerHTML = `<h2 style="color:red">❌ NO EXISTE</h2>El ID ${idParaBuscar} no está en la base de datos.`;
        }
    } catch (error) {
        resultadoDiv.innerHTML = "❌ Error de conexión o reglas.";
        console.error(error);
    }
}
