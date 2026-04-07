import { db,storage } from "./firebase.js"

import {
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

import {
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js"

let qrID=""

window.crearQR=async function(){

let casa=localStorage.getItem("casa") || "N/A"
let autoriza=localStorage.getItem("usuario") || "Residente"

let nombre=document.getElementById("nombre").value
let telefono=document.getElementById("telefono").value
let tipo=document.getElementById("tipo").value

if(!nombre || !telefono){
alert("Completa todos los datos")
return
}

let archivo=document.getElementById("foto").files[0]

let fotoURL=""

// 📷 SUBIR FOTO
if(archivo){

let referencia=ref(storage,"ids/"+Date.now())

await uploadBytes(referencia,archivo)

fotoURL=await getDownloadURL(referencia)

}

// ⏱️ FECHA
let timestamp=Date.now()

// 💾 GUARDAR EN FIREBASE
let docRef=await addDoc(collection(db,"visitas"),{

casa,
autoriza,
nombre,
telefono,
tipo,
fotoURL,
timestamp,
usado:false

})

// 🆔 ID DEL QR
qrID=docRef.id

// 🔗 LINK DEL QR (IMPORTANTE)
let qrLink="https://valle-esmeralda-accesos.web.app/verqr.html?id="+qrID

// 📲 GENERAR QR
document.getElementById("qr").innerHTML=""

new QRCode(document.getElementById("qr"),{
text:qrLink,
width:220,
height:220
})

}

// 📲 ENVIAR WHATSAPP
window.enviarWhats=function(){

let telefono=document.getElementById("telefono").value
let nombre=document.getElementById("nombre").value

let casa=localStorage.getItem("casa") || "N/A"
let autoriza=localStorage.getItem("usuario") || "Residente"

if(!qrID){
alert("Primero genera el QR")
return
}

// 🔗 MISMO LINK DEL QR
let qrLink="https://valle-esmeralda-accesos.web.app/verqr.html?id="+qrID

let mensaje=`ACCESO AUTORIZADO

Fraccionamiento Valle Esmeralda

Visitante: ${nombre}
Casa: ${casa}
Autoriza: ${autoriza}

Mostrar QR en caseta:

${qrLink}`

let url="https://wa.me/52"+telefono+"?text="+encodeURIComponent(mensaje)

window.open(url)

}
