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
let scanner = null

window.iniciarCamara = async function(){

const html5QrCode = new Html5Qrcode("reader")

try{

const devices = await Html5Qrcode.getCameras()

let cameraId = devices.length > 1 ? devices[1].id : devices[0].id

scanner = html5QrCode

await scanner.start(
cameraId,
{
fps: 15,
qrbox: { width: 250, height: 250 }
},
onScanSuccess
)

}catch(e){
alert("Error cámara: " + e)
}

}

async function onScanSuccess(qrID){

try{

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

await scanner.stop()

}catch(e){
document.getElementById("resultado").innerHTML="ERROR"
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
fecha: Date.now()
})

alert("Registro guardado")

}
