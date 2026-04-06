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

function procesarQR(decodedText){

try{

// 🔥 SI ES URL
if(decodedText.includes("data=")){

let url = new URL(decodedText)
let encoded = url.searchParams.get("data")

if(!encoded){
throw "QR inválido"
}

let json = atob(encoded)
datosVisita = JSON.parse(json)

}else{
// 🔥 SI ES JSON DIRECTO
datosVisita = JSON.parse(decodedText)
}

let ahora = Date.now()

let expiracion = {
visita:86400000,
proveedor:43200000,
uber:7200000,
paqueteria:43200000
}

let resultado = document.getElementById("resultado")

if(ahora - datosVisita.timestamp > expiracion[datosVisita.tipo]){
resultado.innerHTML = "❌ QR EXPIRADO"
return
}

resultado.innerHTML = `
✅ ACCESO PERMITIDO <br>
Visitante: ${datosVisita.nombre} <br>
Casa: ${datosVisita.casa} <br>
Autoriza: ${datosVisita.autoriza} <br>
Tipo: ${datosVisita.tipo}
`

}catch(e){
document.getElementById("resultado").innerHTML = "❌ QR INVÁLIDO"
}

}

window.iniciarCamara = () => {

const html5QrCode = new Html5Qrcode("reader")

Html5Qrcode.getCameras().then(devices => {

if(devices && devices.length){

let camara = devices[0].id

html5QrCode.start(
camara,
{ fps: 10, qrbox: 250 },
(decodedText) => {
procesarQR(decodedText)
},
(errorMessage) => {}
)

}else{
alert("No hay cámara disponible")
}

}).catch(err => {
alert("Error al acceder a cámara")
})

}

window.guardarFoto = async function(){

let archivo = document.getElementById("fotoCaseta").files[0]
if(!archivo || !datosVisita)return

let referencia = ref(storage,"idsCaseta/"+Date.now())

await uploadBytes(referencia,archivo)

let url = await getDownloadURL(referencia)

await addDoc(collection(db,"registroAccesos"),{
nombre:datosVisita.nombre,
autoriza:datosVisita.autoriza,
casa:datosVisita.casa,
tipo:datosVisita.tipo,
foto:url,
fecha:Date.now()
})

alert("Registro guardado")

}
