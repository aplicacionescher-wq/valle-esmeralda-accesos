import { db } from "./firebase.js"
import {
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

window.crearQR = async function(){

let nombre = document.getElementById("nombre").value
let casa = document.getElementById("casa").value
let autoriza = document.getElementById("autoriza").value
let tipo = document.getElementById("tipo").value

if(!nombre || !casa || !autoriza){
alert("Completa todos los campos")
return
}

// 🔥 Guardar en Firebase
let docRef = await addDoc(collection(db,"visitas"),{
nombre,
casa,
autoriza,
tipo,
timestamp: Date.now()
})

// 🔥 SOLO ID en QR (mucho más fácil de leer)
let id = docRef.id

let qrDiv = document.getElementById("qr")
qrDiv.innerHTML = ""

new QRCode(qrDiv,{
text: id,
width:200,
height:200
})

window.qrID = id

}

window.enviarWhats = function(){

if(!window.qrID){
alert("Primero genera el QR")
return
}

let mensaje = "Acceso QR:\nID: " + window.qrID

let url = "https://wa.me/?text=" + encodeURIComponent(mensaje)

window.open(url)

}
