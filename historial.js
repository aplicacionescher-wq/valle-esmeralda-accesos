import { db } from "./firebase.js";
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function cargar() {
    const q = query(collection(db, "registroAccesos"), orderBy("fecha", "desc"));
    const snap = await getDocs(q);
    const body = document.querySelector("#tabla-registros tbody");
    body.innerHTML = "";
    snap.forEach(doc => {
        const d = doc.data();
        body.innerHTML += `<tr>
            <td>${new Date(d.fecha).toLocaleString()}</td>
            <td>${d.nombre}</td>
            <td>${d.casa}</td>
            <td>${d.tipo}</td>
            <td><a href="${d.fotoEvidencia}" target="_blank">Ver</a></td>
        </tr>`;
    });
}

window.exportarExcel = function() {
    const table = document.getElementById("tabla-registros").outerHTML;
    const blob = new Blob([table], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "historial_accesos.xls";
    a.click();
};

cargar();
