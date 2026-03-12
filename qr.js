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

let qrData=""

window.crearQR=async function(){

let casa=localStorage.getItem("casa")

let autoriza=localStorage.getItem("usuario")

let nombre=document.getElementById("nombre").value

let telefono=document.getElementById("telefono").value

let tipo=document.getElementById("tipo").value

let archivo=document.getElementById("foto").files[0]

let fotoURL=""

if(archivo){

let referencia=ref(storage,"ids/"+Date.now())

await uploadBytes(referencia,archivo)

fotoURL=await getDownloadURL(referencia)

}

let timestamp=Date.now()

let data={

casa,

autoriza,

nombre,

telefono,

tipo,

fotoURL,

timestamp

}

await addDoc(collection(db,"visitas"),data)

qrData=JSON.stringify(data)

document.getElementById("qr").innerHTML=""

new QRCode(document.getElementById("qr"),{

text:qrData,

width:220,

height:220

})

}

window.enviarWhats=function(){

let telefono=document.getElementById("telefono").value

let casa=localStorage.getItem("casa")

let autoriza=localStorage.getItem("usuario")

let nombre=document.getElementById("nombre").value

let mensaje=`ACCESO AUTORIZADO

Fraccionamiento Valle Esmeralda

Visitante: ${nombre}

Casa: ${casa}

Autoriza: ${autoriza}

Presenta este QR en la caseta`

let url="https://wa.me/52"+telefono+"?text="+encodeURIComponent(mensaje)

window.open(url)

}
