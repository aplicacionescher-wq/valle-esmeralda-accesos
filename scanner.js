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
let html5QrCode = null

// 🔍 ESCANEO
function onScanSuccess(decodedText){

let resultado = document.getElementById("resultado")

// 🔗 SI ES LINK (QR NUEVO)
if(decodedText.includes("verqr.html")){

resultado.innerHTML = "🔗 QR detectado, abriendo..."

window.location.href = decodedText
return
}

try{

// 📦 SI ES JSON
let data = JSON.parse(decodedText)
datosVisita = data

resultado.innerHTML = `
✅ ACCESO PERMITIDO <br><br>
👤 ${data.nombre} <br>
🏠 Casa: ${data.casa} <br>
🧑 Autoriza: ${data.autoriza} <br>
🚗 Tipo: ${data.tipo}
`

}catch(e){

resultado.innerHTML = "⚠️ QR inválido"

}

}

// 📷 ACTIVAR CÁMARA
window.activarCamara = async () => {

let mensaje = document.getElementById("mensaje")

mensaje.innerHTML = "🔄 Activando cámara..."

try{

html5QrCode = new Html5Qrcode("reader")

const devices = await Html5Qrcode.getCameras()

if(devices.length){

let camara = devices[devices.length - 1].id

await html5QrCode.start(
camara,
{ fps: 10, qrbox: 250 },
onScanSuccess
)

mensaje.innerHTML = "✅ Cámara activa"

}else{

mensaje.innerHTML = "❌ No hay cámara disponible"

}

}catch(err){

console.error(err)

mensaje.innerHTML = `
❌ Error al activar cámara <br><br>
👉 Permite acceso a cámara <br>
👉 Usa Chrome <br>
👉 No abras desde WhatsApp
`

}

}

// 💾 GUARDAR ACCESO
window.guardarFoto = async function(){

if(!datosVisita){
alert("Primero escanea un QR válido")
return
}

let archivo = document.getElementById("fotoCaseta").files[0]

if(!archivo){
alert("Selecciona una foto")
return
}

let referencia = ref(storage, "idsCaseta/" + Date.now())

await uploadBytes(referencia, archivo)

let url = await getDownloadURL(referencia)

await addDoc(collection(db, "registroAccesos"), {

nombre: datosVisita.nombre,
autoriza: datosVisita.autoriza,
casa: datosVisita.casa,
tipo: datosVisita.tipo,
foto: url,
fecha: Date.now()

})

alert("✅ Acceso guardado")

}
