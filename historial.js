<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Historial</title>
<link rel="stylesheet" href="estilos.css">
</head>

<body>

<div class="container">

<h2>Historial</h2>

<input type="date" id="fechaInicio">
<input type="date" id="fechaFin">

<button onclick="cargarDatos()">Filtrar</button>
<button onclick="exportarExcel()">Exportar Excel</button>

<table border="1" style="width:100%">
<thead>
<tr>
<th>Nombre</th>
<th>Casa</th>
<th>Autoriza</th>
<th>Tipo</th>
<th>Fecha</th>
</tr>
</thead>
<tbody id="tabla"></tbody>
</table>

</div>

<script type="module">

import { db } from "./firebase.js"
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

let datosGlobal=[]

window.cargarDatos=async function(){

let inicio=document.getElementById("fechaInicio").value
let fin=document.getElementById("fechaFin").value

let tabla=document.getElementById("tabla")
tabla.innerHTML=""

let ref=collection(db,"registroAccesos")
let q=ref

if(inicio && fin){

let i=new Date(inicio).getTime()
let f=new Date(fin).getTime()+86400000

q=query(ref,where("fecha",">=",i),where("fecha","<=",f))
}

let snap=await getDocs(q)

datosGlobal=[]

snap.forEach(doc=>{
let d=doc.data()
datosGlobal.push(d)

tabla.innerHTML+=`
<tr>
<td>${d.nombre}</td>
<td>${d.casa}</td>
<td>${d.autoriza}</td>
<td>${d.tipo}</td>
<td>${new Date(d.fecha).toLocaleString()}</td>
</tr>`
})

}

window.exportarExcel=function(){

let csv="Nombre,Casa,Autoriza,Tipo,Fecha\n"

datosGlobal.forEach(d=>{
csv+=`${d.nombre},${d.casa},${d.autoriza},${d.tipo},${new Date(d.fecha).toLocaleString()}\n`
})

let blob=new Blob([csv])
let url=URL.createObjectURL(blob)

let a=document.createElement("a")
a.href=url
a.download="historial.csv"
a.click()

}

</script>

</body>
</html>
