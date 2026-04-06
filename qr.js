import { db, storage } from "./firebase.js"

import {
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

import {
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js"

let datosVisita = null

window.iniciarCamara = async function(){

const html5QrCode = new Html5Qrcode("reader")

await html5QrCode.start(
{ facingMode: "environment" },
{
fps: 15,
qrbox: { width: 250, height: 250 },
aspectRatio: 1.0
},
onScanSuccess,
(error) => {
// ignorar errores de lectura
}
)

}

function onScanSuccess(decodedText){

try{

console.log("QR detectado:", decodedText)

// 🔥 IMPORTANTE: volver a leer JSON
let data = JSON.parse(decodedText)

datosVisita = data

let ahora = Date.now()

let expiracion = {
visita:86400000,
proveedor:43200000,
uber:7200000,
paqueteria:43200000
}

if(!expiracion[data.tipo]){
document.getElementById("resultado").innerHTML="QR INVÁLIDO"
return
}

if(ahora - data.timestamp > expiracion[data.tipo]){
document.getElementById("resultado").innerHTML="QR EXPIRADO"
return
}

document.getElementById("resultado").innerHTML = `
ACCESO PERMITIDO<br>
${data.nombre}<br>
Casa: ${data.casa}
`

}catch(e){

console.log("Error leyendo QR:", e)
document.getElementById("resultado").innerHTML="QR NO VÁLIDO"

}

}
