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

// guardar en firebase
let docRef = await addDoc(collection(db,"visitas"),{
nombre,
casa,
autoriza,
tipo,
timestamp: Date.now()
})

// usar solo ID
let id = docRef.id

let qrDiv = document.getElementById("qr")
qrDiv.innerHTML = ""

new QRCode(qrDiv,{
text: id,
width:220,
height:220
})

}
