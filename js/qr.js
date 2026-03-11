import { db } from "./firebase.js";

import {
addDoc,
collection
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let qrData = "";

function obtenerHora(){

let ahora = new Date();

let horas = ahora.getHours().toString().padStart(2,"0");
let minutos = ahora.getMinutes().toString().padStart(2,"0");

return horas + ":" + minutos + " hrs";

}

window.crearQR = async function(){

let casa = localStorage.getItem("casa");

let nombre = document.getElementById("nombre").value;

let tipo = document.getElementById("tipo").value;

let telefono = document.getElementById("telefono").value;

let timestamp = Date.now();

let hora = obtenerHora();

let token = Math.random().toString(36).substring(2);

let data = {

token,
casa,
nombre,
tipo,
hora,
timestamp,
usado:false

};

await addDoc(collection(db,"visitas"),data);

qrData = JSON.stringify(data);

document.getElementById("qr").innerHTML="";

new QRCode(document.getElementById("qr"),{

text:qrData,
width:200,
height:200

});

}

window.enviarWhatsApp = function(){

let telefono = document.getElementById("telefono").value;

let mensaje = "QR de acceso Valle Esmeralda: " + qrData;

let url = "https://wa.me/"+telefono+"?text="+encodeURIComponent(mensaje);

window.open(url);

}
