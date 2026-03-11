function onScanSuccess(decodedText){

let data = JSON.parse(decodedText);

let ahora = Date.now();

let expiracion = {

visita:86400000,
proveedor:43200000,
uber:7200000,
paqueteria:43200000

};

let resultado = document.getElementById("resultado");

if(ahora - data.hora > expiracion[data.tipo]){

resultado.innerHTML="❌ QR EXPIRADO";
resultado.style.background="red";

return;

}

resultado.innerHTML="✅ ACCESO PERMITIDO<br>"+data.casa;

resultado.style.background="green";

}

const html5QrCode = new Html5QrcodeScanner(
"reader",
{ fps:10, qrbox:250 });

html5QrCode.render(onScanSuccess);
