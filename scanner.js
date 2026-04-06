import { db, storage } from "./firebase.js"

import {
doc,
getDoc,
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
{ fps: 10, qrbox: 250 },
async (qrID) => {

try{

// 🔥 Buscar en Firebase
let docRef = doc(db,"visitas",qrID)
let snap = await getDoc(docRef)

if(!snap.exists()){
document.getElementById("resultado").innerHTML="QR INVÁLIDO"
return
}

let data = snap.data()
datosVisita = data

let ahora = Date.now()

let expiracion = {
visita:86400000,
proveedor:43200000,
uber:7200000,
paqueteria:43200000
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

html5QrCode.stop()

}catch(e){
document.getElementById("resultado").innerHTML="ERROR"
}

})

}
