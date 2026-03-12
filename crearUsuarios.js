import { db } from "./firebase.js";

import {
addDoc,
collection
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const calles = [

"Valle Turquesa Norte",
"Valle Turquesa Sur",
"Valle Turquesa Oriente",
"Valle Turquesa Poniente",
"Valle de la Perla",
"Valle de Onix",
"Valle de Opalo"

];

async function crearUsuarios(){

for(let calle of calles){

for(let i=1; i<=100; i++){

let domicilio = calle + " " + i;

await addDoc(collection(db,"usuarios"),{

domicilio: domicilio,
password: "1234",
rol: "residente"

});

console.log("Creado:", domicilio);

}

}

console.log("Usuarios creados");

}

crearUsuarios();
