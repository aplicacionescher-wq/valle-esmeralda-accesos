import { db } from "./firebase.js"

import {
collection,
addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

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

let qrID = docRef.id

// 🔥 GENERAR IMAGEN QR
QRCode.toDataURL(qrID, { width: 250 }, function(err, url){

if(err){
console.error(err)
alert("Error generando QR")
return
}

// 🔥 MOSTRAR IMAGEN
document.getElementById("qrcode").innerHTML = `
<p>ID: ${qrID}</p>
<img src="${url}" />
`

})

}catch(e){

console.error(e)
alert("Error general")

}

}
