let datosGlobal = null

window.crearQR = () => {

let nombre = document.getElementById("nombre")
let casa = document.getElementById("casa")
let autoriza = document.getElementById("autoriza")
let tipo = document.getElementById("tipo")

// VALIDACIÓN
if(!nombre || !casa || !autoriza || !tipo){
alert("Error: faltan campos en el formulario")
return
}

if(!nombre.value || !casa.value || !autoriza.value){
alert("Completa todos los campos")
return
}

let data = {
nombre: nombre.value,
casa: casa.value,
autoriza: autoriza.value,
tipo: tipo.value,
timestamp: Date.now()
}

datosGlobal = data

let encoded = btoa(JSON.stringify(data))

let url = location.origin + "/verqr.html?data=" + encoded

document.getElementById("qr").innerHTML = ""

new QRCode(document.getElementById("qr"), url)

}

window.enviarWhats = () => {

if(!datosGlobal){
alert("Primero genera el QR")
return
}

let encoded = btoa(JSON.stringify(datosGlobal))

let url = location.origin + "/verqr.html?data=" + encoded

window.open("https://wa.me/?text=" + encodeURIComponent("Acceso QR: " + url))

}
