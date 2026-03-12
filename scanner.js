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

let datosVisita=null

function onScanSuccess(decodedText){

let data=JSON.parse(decodedText)

datosVisita=data

let ahora=Date.now()

let expiracion={

visita:86400000,
proveedor:43200000,
uber:7200000,
paqueteria:43200000

}

let resultado=document.getElementById("resultado")

if(ahora-data.timestamp>expiracion[data.tipo]){

resultado.innerHTML="QR EXPIRADO"
return

}

resultado.innerHTML="ACCESO PERMITIDO<br>"+data.nombre

if(data.fotoURL){

document.getElementById("foto").innerHTML=

"<img src='"+data.fotoURL+"' width='200'>"

}

}

window.guardarFoto=async function(){

let archivo=document.getElementById("fotoCaseta").files[0]

if(!archivo)return

let referencia=ref(storage,"idsCaseta/"+Date.now())

await uploadBytes(referencia,archivo)

let url=await getDownloadURL(referencia)

await addDoc(collection(db,"registroAccesos"),{

nombre:datosVisita.nombre,

casa:datosVisita.casa,

foto:url,

fecha:Date.now()

})

alert("Registro guardado")

}

const html5QrCode=new Html5QrcodeScanner(
"reader",
{fps:10,qrbox:250}
)

html5QrCode.render(onScanSuccess)
