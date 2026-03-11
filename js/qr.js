import { db } from "./firebase.js";

import {
addDoc,
collection
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

let timestamp = Date.now();

let hora = obtenerHora();

let foto = document.getElementById("foto").files[0];

let fotoURL = "";

if(foto){

fotoURL = URL.createObjectURL(foto);

}

let data = {

casa,
nombre,
tipo,
hora,
timestamp,
foto:fotoURL

};

await addDoc(collection(db,"visitas"),data);

let texto = JSON.stringify(data);

document.getElementById("qr").innerHTML="";

new QRCode(document.getElementById("qr"),{

text:texto,
width:200,
height:200

});

}
