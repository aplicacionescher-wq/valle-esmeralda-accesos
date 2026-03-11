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

if(ahora - data.timestamp > expiracion[data.tipo]){

resultado.innerHTML="❌ QR EXPIRADO";

resultado.style.background="red";

return;

}

resultado.innerHTML=

"✅ ACCESO PERMITIDO<br>"+
"Casa: "+data.casa+"<br>"+
"Visitante: "+data.nombre+"<br>"+
"Hora QR: "+data.hora;

if(data.foto){

resultado.innerHTML +=
"<br><img src='"+data.foto+"' width='150'>";

}

resultado.style.background="green";

}

const html5QrCode = new Html5QrcodeScanner(

"reader",

{ fps:10, qrbox:250 }

);

html5QrCode.render(onScanSuccess);
