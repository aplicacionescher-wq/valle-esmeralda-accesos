import { db } from "./firebase.js";

import {
addDoc,
collection
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let qrData="";

window.crearQR = async function(){

let casa=localStorage.getItem("casa");

let nombre=document.getElementById("nombre").value;

let tipo=document.getElementById("tipo").value;

let file=document.getElementById("identificacion").files[0];

let identificacion="";

if(file){

identificacion=URL.createObjectURL(file);

}

let timestamp=Date.now();

let token=Math.random().toString(36).substring(2);

let data={

token,
casa,
nombre,
tipo,
timestamp,
identificacion,
usado:false

};

await addDoc(collection(db,"visitas"),data);

qrData=JSON.stringify(data);

new QRCode(document.getElementById("qr"),{

text:qrData,
width:200,
height:200

});

}

window.enviarWhatsApp=function(){

let telefono=document.getElementById("telefono").value;

let mensaje="QR acceso Valle Esmeralda "+qrData;

let url="https://wa.me/"+telefono+"?text="+encodeURIComponent(mensaje);

window.open(url);

}
