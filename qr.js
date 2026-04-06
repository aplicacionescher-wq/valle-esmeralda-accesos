let datosGlobal = null

window.crearQR = () => {

let data = {
nombre: document.getElementById("nombre").value,
casa: document.getElementById("casa").value,
autoriza: document.getElementById("autoriza").value,
tipo: document.getElementById("tipo").value,
timestamp: Date.now()
}

datosGlobal = data

let encoded = btoa(JSON.stringify(data))

let url = location.origin + "/verqr.html?data=" + encoded

document.getElementById("qr").innerHTML = ""

new QRCode(document.getElementById("qr"), url)

}

// 📲 ENVIAR WHATSAPP
window.enviarWhats = () => {

if (!datosGlobal) {
alert("Primero genera el QR")
return
}

let encoded = btoa(JSON.stringify(datosGlobal)

)

let url = location.origin + "/verqr.html?data=" + encoded

let mensaje = "Acceso QR: " + url

window.open("https://wa.me/?text=" + encodeURIComponent(mensaje))

}
