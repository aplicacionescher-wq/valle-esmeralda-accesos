import { db } from "./firebase.js";

import {
collection,
query,
where,
getDocs,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

function onScanSuccess(decodedText){

let data = JSON.parse(decodedText);

let ahora = Date.now();

let expiracion = {

visita:86400000,
proveedor:43200000,
uber:7200000,
paqueteria:43200000

};

let resultado = document.getElementById("resultado");

if(ahora - data.timestamp > expiracion[data.tipo]){

resultado.innerHTML="❌ QR EXPIRADO";

resultado.style.background="red";

return;

}

verificarUso(data);

}

async function verificarUso(data){

let resultado = document.getElementById("resultado");

const q = query(
collection(db,"visitas"),
where("token","==",data.token)
);

const querySnapshot = await getDocs(q);

querySnapshot.forEach(async (doc)=>{

let visita = doc.data();

if(visita.usado){

resultado.innerHTML="❌ QR YA UTILIZADO";

resultado.style.background="red";

return;

}

await updateDoc(doc.ref,{usado:true});

resultado.innerHTML=

"✅ ACCESO PERMITIDO<br>"+
"Casa: "+visita.casa+"<br>"+
"Visitante: "+visita.nombre+"<br>"+
"Hora: "+visita.hora;

resultado.style.background="green";

});

}

const html5QrCode = new Html5QrcodeScanner(
"reader",
{ fps:10, qrbox:250 }
);

html5QrCode.render(onScanSuccess);
