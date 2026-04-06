window.crearQR = () => {

let nombre = document.getElementById("nombre")
let casa = document.getElementById("casa")
let autoriza = document.getElementById("autoriza")
let tipo = document.getElementById("tipo")

if(!nombre || !casa || !autoriza || !tipo){
alert("Error: IDs no encontrados")
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

let encoded = btoa(JSON.stringify(data))

let url = location.origin + "/valle-esmeralda-accesos/verqr.html?data=" + encoded

document.getElementById("qr").innerHTML = ""

new QRCode(document.getElementById("qr"), url)

}
