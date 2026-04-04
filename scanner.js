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

// 🔍 CUANDO ESCANEA
function onScanSuccess(decodedText) {

try {

let data = JSON.parse(decodedText)
datosVisita = data

let ahora = Date.now()

let expiracion = {
visita: 86400000,
proveedor: 43200000,
uber: 7200000,
paqueteria: 43200000
}

let resultado = document.getElementById("resultado")

if (ahora - data.timestamp > expiracion[data.tipo]) {
resultado.innerHTML = "❌ QR EXPIRADO"
return
}

resultado.innerHTML = `
✅ ACCESO PERMITIDO <br><br>
👤 Visitante: ${data.nombre} <br>
🏠 Casa: ${data.casa} <br>
🧑 Autoriza: ${data.autoriza} <br>
🚗 Tipo: ${data.tipo}
`

// FOTO VISITANTE
if (data.fotoURL) {
document.getElementById("foto").innerHTML =
"<img src='" + data.fotoURL + "' width='200'>"
}

} catch (error) {
document.getElementById("resultado").innerHTML = "⚠️ QR inválido"
}

}

// 📷 GUARDAR REGISTRO
window.guardarFoto = async function () {

if (!datosVisita) {
alert("Primero escanea un QR")
return
}

let archivo = document.getElementById("fotoCaseta").files[0]

if (!archivo) {
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

alert("✅ Registro guardado")

}

// 🚀 INICIAR ESCÁNER
function iniciarScanner() {

if (!navigator.mediaDevices) {
document.getElementById("reader").innerHTML =
"❌ Tu dispositivo no soporta cámara"
return
}

try {

const html5QrCode = new Html5QrcodeScanner(
"reader",
{ fps: 10, qrbox: 250 }
)

html5QrCode.render(onScanSuccess)

} catch (error) {

console.error(error)

document.getElementById("reader").innerHTML = `
❌ Error al acceder a la cámara <br><br>
👉 Permite permisos o usa celular
`

}

}

// ▶️ INICIAR
iniciarScanner()
