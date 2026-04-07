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

let html5QrCode
let datosQR = null

// 🔥 ACTIVAR CÁMARA
window.iniciarCamara = async function(){

try{

html5QrCode = new Html5Qrcode("reader")

await html5QrCode.start(
{ facingMode: "environment" }, // 🔥 cámara trasera
{
fps: 10,
qrbox: 250
},
onScanSuccess
)

}catch(e){
alert("No se pudo activar la cámara")
console.error(e)
}

}

// 📲 CUANDO ESCANEA
async function onScanSuccess(qrID){

await validarQR(qrID)

}

// 🔍 VALIDAR QR
async function validarQR(qrID){

try{

let refDoc = doc(db,"visitas",qrID)
let snap = await getDoc(refDoc)

if(!snap.exists()){
document.getElementById("resultado").innerHTML =
"<span style='color:red'>QR INVÁLIDO</span>"
return
}

datosQR = snap.data()

document.getElementById("resultado").innerHTML = `
<span style="color:lightgreen">ACCESO PERMITIDO</span><br>
Nombre: ${datosQR.nombre}<br>
Casa: ${datosQR.casa}
`

await html5QrCode.stop()

}catch(e){
console.error(e)
document.getElementById("resultado").innerHTML =
"<span style='color:red'>ERROR</span>"
}

}

// 💾 GUARDAR ACCESO
window.guardarAcceso = async function(){

if(!datosQR){
alert("Primero escanea un QR")
return
}

let archivo = document.getElementById("foto").files[0]

if(!archivo){
alert("Sube foto de identificación")
return
}

// 🔥 subir imagen
let referencia = ref(storage,"identificaciones/"+Date.now())

await uploadBytes(referencia,archivo)

let url = await getDownloadURL(referencia)

// 🔥 guardar registro
await addDoc(collection(db,"registros"),{
...datosQR,
foto:url,
fecha: Date.now()
})

alert("Acceso guardado")

// 🔁 reiniciar pantalla
location.reload()

}

// 🔐 CERRAR SESIÓN
window.cerrarSesion = function(){

// si usas Firebase Auth:
location.href = "index.html"

}
