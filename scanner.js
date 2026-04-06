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
let scanner = null

window.iniciarCamara = async function(){

const html5QrCode = new Html5Qrcode("reader")

try{

// 🔥 Obtener cámaras disponibles
const devices = await Html5Qrcode.getCameras()

if(devices && devices.length){

// 🔥 Buscar cámara trasera
let camaraTrasera = devices.find(d =>
d.label.toLowerCase().includes("back") ||
d.label.toLowerCase().includes("rear")
)

// Si no encuentra, usa la última (normalmente trasera)
let cameraId = camaraTrasera ? camaraTrasera.id : devices[devices.length - 1].id

scanner = html5QrCode

await scanner.start(
cameraId,
{ fps: 10, qrbox: 250 },
onScanSuccess
)

}else{
alert("No hay cámaras disponibles")
}

}catch(e){
alert("Error cámara: " + e)
}

}

function onScanSuccess(decodedText){

try{

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

scanner.stop()

}catch(e){
document.getElementById("resultado").innerHTML="QR INVÁLIDO"
}

}

window.guardarFoto = async function(){

if(!datosVisita){
alert("Escanea primero")
return
}

let archivo = document.getElementById("fotoCaseta").files[0]

if(!archivo){
alert("Selecciona foto")
return
}

let referencia = ref(storage,"registros/"+Date.now())

await uploadBytes(referencia,archivo)

let url = await getDownloadURL(referencia)

await addDoc(collection(db,"registroAccesos"),{
...datosVisita,
foto:url,
fecha:Date.now()
})

alert("Registro guardado")

}
