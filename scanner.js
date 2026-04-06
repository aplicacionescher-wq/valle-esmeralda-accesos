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

// 🔥 PROCESAR QR
function procesarQR(decodedText){

try{

// 👉 SI ES URL (TU CASO)
if(decodedText.includes("data=")){
let url = new URL(decodedText)
let encoded = url.searchParams.get("data")
datosVisita = JSON.parse(atob(encoded))
}else{
// 👉 SI ES JSON
datosVisita = JSON.parse(decodedText)
}

// VALIDAR EXPIRACIÓN
let ahora = Date.now()

let expiracion = {
visita:86400000,
proveedor:43200000,
uber:7200000,
paqueteria:43200000
}

if(ahora - datosVisita.timestamp > expiracion[datosVisita.tipo]){
document.getElementById("resultado").innerHTML = "❌ QR EXPIRADO"
return
}

// MOSTRAR INFO
document.getElementById("resultado").innerHTML = `
✅ ACCESO PERMITIDO <br><br>
👤 ${datosVisita.nombre} <br>
🏠 Casa: ${datosVisita.casa} <br>
🛂 Autoriza: ${datosVisita.autoriza} <br>
📦 Tipo: ${datosVisita.tipo}
`

}catch(e){
document.getElementById("resultado").innerHTML = "❌ QR INVÁLIDO"
}

}

// 📷 ACTIVAR CÁMARA
window.iniciarCamara = () => {

const qr = new Html5Qrcode("reader")

Html5Qrcode.getCameras().then(devices => {

if(devices.length){

qr.start(
devices[0].id,
{ fps: 10, qrbox: 250 },
(text) => {
procesarQR(text)
},
(err) => {}
)

}else{
alert("No hay cámara")
}

}).catch(err => {
alert("Error al acceder a la cámara")
})

}

// 💾 REGISTRAR EN FIREBASE
window.guardarAcceso = async () => {

let archivo = document.getElementById("fotoCaseta").files[0]

if(!datosVisita){
alert("Primero escanea el QR")
return
}

if(!archivo){
alert("Toma una foto")
return
}

try{

let referencia = ref(storage,"accesos/"+Date.now())

await uploadBytes(referencia,archivo)

let url = await getDownloadURL(referencia)

await addDoc(collection(db,"registroAccesos"),{
nombre:datosVisita.nombre,
casa:datosVisita.casa,
autoriza:datosVisita.autoriza,
tipo:datosVisita.tipo,
foto:url,
fecha:Date.now()
})

alert("✅ Entrada registrada")

}catch(error){
alert("Error al guardar")
console.error(error)
}

}
