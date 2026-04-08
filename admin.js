import { db } from "./firebase.js";

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function cargarAccesos(){

const querySnapshot = await getDocs(collection(db,"visitas"));

let tabla = document.getElementById("tablaAccesos");

querySnapshot.forEach((doc)=>{

let data = doc.data();

let fila = document.createElement("tr");

let fotoHTML = "";

if(data.foto){

fotoHTML = "<img src='"+data.foto+"' width='80'>";

}

fila.innerHTML =

"<td>"+data.casa+"</td>" +
"<td>"+data.nombre+"</td>" +
"<td>"+data.tipo+"</td>" +
"<td>"+data.hora+"</td>" +
"<td>"+fotoHTML+"</td>";

tabla.appendChild(fila);

});

}

cargarAccesos();
