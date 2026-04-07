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

// 🔍 CUANDO ESCANEA
function onScanSuccess(decodedText){

let resultado = document.getElementById("resultado")

// 🔗 SI ES LINK (QR NUEVO)
if(decodedText.startsWith("http")){

resultado.innerHTML = `
🔗 QR detectado <br><br>
Redirigiendo...
`

// Redirige al visor
window.location.href = decodedText
return
}

try{

// 📦 SI ES JSON (QR ANTIGUO)
let data = JSON.parse(decodedText)
datosVisita = data

let ahora = Date.now()

let expiracion = {
visita:86400000,
proveedor:43200000,
uber:7200000,
paqueteria:43200000
}

// ⏱️ VALIDAR
if(ahora - data.timestamp > expiracion[data.tipo]){
resultado.innerHTML = "❌ QR EXPIRADO"
return
}

// ✅ MOSTRAR
resultado.innerHTML = `
✅ ACCESO PERMITIDO <br><br>
👤 ${data.nombre} <br>
🏠 Casa: ${data.casa} <br>
🧑 Autoriza: ${data.autoriza} <br>
🚗 Tipo: ${data.tipo}
`

// 📷 FOTO
if(data.fotoURL){
document.getElementById("foto").innerHTML =
"<img src='"+data.fotoURL+"' width='200'>"
}

}catch(error){

resultado.innerHTML = "⚠️ QR inválido"

}

}

// 📷 ACTIVAR CÁMARA (BOTÓN)
window.activarCamara = async function(){

let reader = document.getElementById("reader")
let mensaje = document.getElementById("mensaje")

mensaje.innerHTML = "🔄 Activando cámara..."

try{

html5QrCode = new Html5Qrcode("reader")

const devices = await Html5Qrcode.getCameras()

if(devices && devices.length){

// 📱 Usa cámara trasera
let camara = devices[devices.length - 1].id

await html5QrCode.start(
camara,
{
fps:10,
qrbox:250
},
onScanSuccess
)

mensaje.innerHTML = "✅ Cámara activa"

}else{

mensaje.innerHTML = "❌ No hay cámara disponible"

}

}catch(error){

console.error(error)

mensaje.innerHTML = `
❌ No se pudo activar la cámara <br><br>

👉 Soluciones: <br>
- Permitir cámara <br>
- Abrir en Chrome <br>
- No usar WhatsApp
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

let referencia = ref(storage,"idsCaseta/"+Date.now())

await uploadBytes(referencia,archivo)

let url = await getDownloadURL(referencia)

await addDoc(collection(db,"registroAccesos"),{

nombre: datosVisita.nombre,
autoriza: datosVisita.autoriza,
casa: datosVisita.casa,
tipo: datosVisita.tipo,
foto: url,
fecha: Date.now()

})

alert("✅ Acceso guardado correctamente")

}
