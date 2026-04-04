import { db,storage } from "./firebase.js"

import {
collection,
addDoc,
doc,
getDoc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

import {
ref,
uploadBytes,
getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js"

let datosVisita=null

async function onScanSuccess(decodedText){

let data=JSON.parse(decodedText)

let resultado=document.getElementById("resultado")

try{

// 🔍 VALIDAR CONTRA FIREBASE
let refDoc=doc(db,"visitas",data.id)

let snap=await getDoc(refDoc)

if(!snap.exists()){

resultado.innerHTML="QR NO VÁLIDO"
return

}

let visita=snap.data()

datosVisita=visita

// ⏱️ VALIDAR EXPIRACIÓN
let ahora=Date.now()

let expiracion={
visita:86400000,
proveedor:43200000,
uber:7200000,
paqueteria:43200000
}

if(ahora-visita.timestamp>expiracion[visita.tipo]){

resultado.innerHTML="QR EXPIRADO"
return

}

// 🔐 VALIDAR SI YA SE USÓ
if(visita.usado){

resultado.innerHTML="⚠️ QR YA UTILIZADO"
return

}

// ✅ MARCAR COMO USADO
await updateDoc(refDoc,{usado:true})

// ✅ MOSTRAR INFO
resultado.innerHTML=`

ACCESO PERMITIDO

Visitante: ${visita.nombre}
Casa: ${visita.casa}
Autoriza: ${visita.autoriza}
Tipo: ${visita.tipo}

`

// 📷 FOTO VISITANTE
if(visita.fotoURL){

document.getElementById("foto").innerHTML=
"<img src='"+visita.fotoURL+"' width='200'>"

}

}catch(error){

console.error(error)
resultado.innerHTML="ERROR AL ESCANEAR"

}

}

window.guardarFoto=async function(){

if(!datosVisita){
alert("Primero escanea un QR")
return
}

let archivo=document.getElementById("fotoCaseta").files[0]

if(!archivo)return

let referencia=ref(storage,"idsCaseta/"+Date.now())

await uploadBytes(referencia,archivo)

let url=await getDownloadURL(referencia)

// 💾 GUARDAR REGISTRO COMPLETO
await addDoc(collection(db,"registroAccesos"),{

nombre:datosVisita.nombre,
autoriza:datosVisita.autoriza,
casa:datosVisita.casa,
tipo:datosVisita.tipo,
foto:url,
fecha:Date.now()

})

alert("Registro guardado correctamente")

}

const html5QrCode=new Html5QrcodeScanner(
"reader",
{fps:10,qrbox:250}
)

html5QrCode.render(onScanSuccess)
