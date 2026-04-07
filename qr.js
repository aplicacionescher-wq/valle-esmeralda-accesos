import { db } from "./firebase.js"

import {
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

// 🔥 ESPERA A QUE CARGUE TODO
window.crearQR = async function(){

try{

// 🔥 OBTENER ELEMENTOS
let nombreInput = document.getElementById("nombre")
let casaInput = document.getElementById("casa")
let tipoInput = document.getElementById("tipo")

// 🚨 VALIDAR EXISTENCIA
if(!nombreInput || !casaInput || !tipoInput){
alert("Error: inputs no encontrados (ID incorrecto)")
return
}

let nombre = nombreInput.value.trim()
let casa = casaInput.value.trim()
let tipo = tipoInput.value

if(nombre === "" || casa === ""){
alert("Completa los campos")
return
}

// 🔥 GUARDAR EN FIREBASE
let docRef = await addDoc(collection(db,"visitas"),{
nombre,
casa,
tipo,
timestamp: Date.now()
})

let qrID = docRef.id

// 🔥 LIMPIAR
let contenedor = document.getElementById("qrcode")
contenedor.innerHTML = ""

// 🔥 GENERAR QR
new QRCode(contenedor, {
text: qrID,
width: 250,
height: 250
})

// 🔥 MOSTRAR ID
let p = document.createElement("p")
p.innerText = "ID: " + qrID
contenedor.appendChild(p)

}catch(e){
console.error(e)
alert("Error al generar QR")
}

}
