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

let html5QrCode = null
let datosVisita = null
let escaneoActivo = true

// 🔊 sonido
const beep = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg")

// 🚀 INICIAR CAMARA AUTOMATICO
window.onload = () => iniciarCamara()

window.iniciarCamara = async function(){

try{

html5QrCode = new Html5Qrcode("reader")

await html5QrCode.start(
{ facingMode: { exact: "environment" } }, // 🔥 FORZAR TRASERA REAL
{
fps: 15,
qrbox: { width: 280, height: 280 }
},
onScanSuccess
)

}catch(e){
console.error(e)
alert("⚠️ No se pudo abrir la cámara. Verifica permisos.")
}

}

// 📲 CUANDO ESCANEA
async function onScanSuccess(qrID){

if(!escaneoActivo) return
escaneoActivo = false

navigator.vibrate(200) // 📳 vibrar
beep.play() // 🔊 sonido

await procesarQR(qrID)

}

// 🔍 VALIDAR QR
async function procesarQR(qrID){

try{

let docRef = doc(db,"visitas",qrID)
let snap = await getDoc(docRef)

if(!snap.exists()){
mostrarError("❌ QR INVÁLIDO")
reactivarScanner()
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
mostrarError("⛔ QR EXPIRADO")
reactivarScanner()
return
}

// ✅ ACCESO PERMITIDO
document.getElementById("resultado").innerHTML = `
<div style="color:#00ff00;font-size:20px;">
✅ ACCESO PERMITIDO
</div>
Nombre: ${data.nombre}<br>
Casa: ${data.casa}<br>
Tipo: ${data.tipo}
`

await html5QrCode.stop()

}catch(e){
console.error(e)
mostrarError("⚠️ ERROR")
reactivarScanner()
}

}

// ❌ ERROR VISUAL
function mostrarError(msg){

document.getElementById("resultado").innerHTML = `
<div style="color:red;font-size:20px;">
${msg}
</div>
`

}

// 🔁 REACTIVAR SCANNER
function reactivarScanner(){
setTimeout(()=>{
escaneoActivo = true
},2000)
}

// 📸 GUARDAR ACCESO
window.guardarAcceso = async function(){

if(!datosVisita){
alert("Escanea primero")
return
}

let archivo = document.getElementById("fotoCaseta").files[0]

if(!archivo){
alert("📸 Toma una foto")
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

alert("✅ Acceso registrado")

location.reload()

}
