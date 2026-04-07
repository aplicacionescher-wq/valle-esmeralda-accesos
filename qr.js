import { db } from "./firebase.js"

import {
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

// 🔥 GENERAR QR
window.crearQR = async function(){

let nombre = document.getElementById("nombre").value
let casa = document.getElementById("casa").value
let tipo = document.getElementById("tipo").value

if(!nombre || !casa){
alert("Completa los campos")
return
}

try{

// 🔥 GUARDAR EN FIREBASE
let docRef = await addDoc(collection(db,"visitas"),{
nombre,
casa,
tipo,
timestamp: Date.now()
})

// 🔥 USAR ID COMO QR
let qrID = docRef.id

// 🔥 LIMPIAR CONTENEDOR
document.getElementById("qrcode").innerHTML = ""

// 🔥 GENERAR IMAGEN QR
QRCode.toCanvas(document.getElementById("qrcode"), qrID, {
width: 250
})

}catch(e){

console.error(e)
alert("Error al generar QR")

}

}
