import { db } from "./firebase.js"

import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

let datos=[]

async function cargar(){

let snap=await getDocs(collection(db,"registroAccesos"))

datos=[]

snap.forEach(doc=>{

datos.push(doc.data())

})

mostrar(datos)

}

function mostrar(lista){

let tbody=document.querySelector("#tabla tbody")

tbody.innerHTML=""

lista.forEach(d=>{

let fecha=new Date(d.fecha).toLocaleString()

tbody.innerHTML+=`
<tr>
<td>${fecha}</td>
<td>${d.nombre}</td>
<td>${d.casa}</td>
<td>${d.autoriza || "-"}</td>
</tr>
`

})

}

window.filtrar=function(){

let desde=document.getElementById("desde").value
let hasta=document.getElementById("hasta").value

if(!desde || !hasta){
alert("Selecciona fechas")
return
}

let d1=new Date(desde).getTime()
let d2=new Date(hasta).getTime()+86400000

let filtrados=datos.filter(d=>{

return d.fecha>=d1 && d.fecha<=d2

})

mostrar(filtrados)

}

window.exportarExcel=function(){

let tabla=document.getElementById("tabla").outerHTML

let blob=new Blob([tabla],{type:"application/vnd.ms-excel"})

let url=URL.createObjectURL(blob)

let a=document.createElement("a")

a.href=url
a.download="historial.xls"
a.click()

}

cargar()
