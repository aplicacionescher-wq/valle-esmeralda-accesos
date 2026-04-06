import { db } from "./firebase.js"
import {
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

window.crearQR = async function(){

try{

let nombre = document.getElementById("nombre").value.trim()
let casa = document.getElementById("casa").value.trim()
let autoriza = document.getElementById("autoriza").value.trim()
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

// 🔥 VALIDAR ID
if(!docRef.id){
alert("Error generando ID")
return
}

let id = docRef.id

console.log("ID generado:", id)

// 🔥 GENERAR QR CON TEXTO REAL
let qrDiv = document.getElementById("qr")
qrDiv.innerHTML = ""

new QRCode(qrDiv,{
text: id,
width:220,
height:220
})

// 🔥 MOSTRAR ID EN PANTALLA (DEBUG)
qrDiv.innerHTML += `<p>ID: ${id}</p>`

}catch(e){

console.error(e)
alert("Error al generar QR")

}

}
