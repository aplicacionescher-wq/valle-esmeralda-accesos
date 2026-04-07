import { db } from "./firebase.js"

import {
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

window.crearQR = async function(){

let nombreInput = document.getElementById("nombre")
let casaInput = document.getElementById("casa")
let tipoInput = document.getElementById("tipo")

if(!nombreInput || !casaInput || !tipoInput){
alert("Error: inputs no encontrados")
return
}

let nombre = nombreInput.value
let casa = casaInput.value
let tipo = tipoInput.value

if(!nombre || !casa){
alert("Completa los campos")
return
}

try{

let docRef = await addDoc(collection(db,"visitas"),{
nombre,
casa,
tipo,
timestamp: Date.now()
})

let qrID = docRef.id

let contenedor = document.getElementById("qrcode")
contenedor.innerHTML = ""

// 🔥 GENERAR QR REAL
new QRCode(contenedor, {
text: qrID,
width: 250,
height: 250
})

// mostrar ID
let info = document.createElement("p")
info.innerText = "ID: " + qrID
contenedor.appendChild(info)

}catch(e){
console.error(e)
alert("Error al generar QR")
}

}
