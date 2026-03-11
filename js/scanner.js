function onScanSuccess(decodedText){

let data = JSON.parse(decodedText);

let ahora = Date.now();

let expiracion = {

visita:86400000,
proveedor:43200000,
uber:7200000,
paqueteria:43200000

};

if(ahora - data.hora > expiracion[data.tipo]){

alert("QR EXPIRADO");

return;

}

alert("Acceso permitido\nCasa: " + data.casa);

}

const html5QrCode = new Html5QrcodeScanner(

"reader",

{ fps: 10, qrbox: 250 }

);

html5QrCode.render(onScanSuccess);
