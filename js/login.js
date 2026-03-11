import { db } from "./firebase.js";

import {
collection,
query,
where,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.login = async function(){

let usuario = document.getElementById("domicilio").value;
let pass = document.getElementById("password").value;

console.log("Intentando login...");

try{

const q = query(
collection(db,"usuarios"),
where("domicilio","==",usuario),
where("password","==",pass)
);

const querySnapshot = await getDocs(q);

console.log("Resultado consulta:",querySnapshot);

if(querySnapshot.empty){

alert("❌ Usuario o contraseña incorrectos");
return;

}

querySnapshot.forEach((doc)=>{

let data = doc.data();

console.log("Usuario encontrado:",data);

localStorage.setItem("rol",data.rol);
localStorage.setItem("casa",data.domicilio);

if(data.rol==="admin") window.location="admin.html";
if(data.rol==="residente") window.location="dashboard.html";
if(data.rol==="caseta") window.location="escaner.html";

});

}catch(error){

console.error("ERROR FIREBASE:",error);

alert("Error conectando con Firebase");

}

}
