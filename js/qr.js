import { db } from "./firebase.js";

import {
addDoc,
collection
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.crearQR = async function(){

let casa = localStorage.getItem("casa");

let nombre = document.getElementById("nombre").value;

let tipo = document.getElementById("tipo").value;

let hora = Date.now();

let data = {
casa,
nombre,
tipo,
hora,
usado:false
};

// guardar en Firebase
await addDoc(collection(db,"visitas"), data);

let texto = JSON.stringify(data);

document.getElementById("qr").innerHTML="";

new QRCode(document.getElementById("qr"),{
text:texto,
width:200,
height:200
});

// enlace WhatsApp
let mensaje =
"Acceso a Valle Esmeralda\\n" +
"Casa: "+casa+"\\n" +
"Visitante: "+nombre+"\\n" +
"Mostrar este QR en caseta";

let url =
"https://wa.me/?text="+encodeURIComponent(mensaje);

let boton = document.createElement("button");

boton.innerText="Enviar por WhatsApp";

boton.onclick = function(){
window.open(url);
};

document.body.appendChild(boton);

}
