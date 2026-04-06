window.crearQR = function(){

let nombre = document.getElementById("nombre").value
let casa = document.getElementById("casa").value
let autoriza = document.getElementById("autoriza").value
let tipo = document.getElementById("tipo").value

if(!nombre || !casa || !autoriza){
alert("Completa todos los campos")
return
}

let datos = {
nombre,
casa,
autoriza,
tipo,
timestamp: Date.now()
}

let qrDiv = document.getElementById("qr")
qrDiv.innerHTML = ""

new QRCode(qrDiv,{
text: JSON.stringify(datos),
width:200,
height:200
})

window.qrData = datos

}

window.enviarWhats = function(){

if(!window.qrData){
alert("Primero genera el QR")
return
}

let mensaje = "Acceso QR:\n" + JSON.stringify(window.qrData)

let url = "https://wa.me/?text=" + encodeURIComponent(mensaje)

window.open(url)

}
