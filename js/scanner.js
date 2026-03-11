function onScanSuccess(decodedText){

let data=JSON.parse(decodedText);

let ahora=Date.now();

let expiracion={

visita:24*60*60*1000,
proveedor:12*60*60*1000,
uber:2*60*60*1000,
paqueteria:12*60*60*1000

};

let resultado=document.getElementById("resultado");

if(ahora-data.timestamp>expiracion[data.tipo]){

resultado.innerHTML="QR EXPIRADO";
return;

}

resultado.innerHTML=

"ACCESO PERMITIDO<br>"+
"Casa:"+data.casa+"<br>"+
"Visitante:"+data.nombre;

if(data.identificacion){

resultado.innerHTML+=
"<br><img src='"+data.identificacion+"' width='200'>";

}

}

const html5QrCode=new Html5QrcodeScanner(
"reader",
{fps:10,qrbox:250}
);

html5QrCode.render(onScanSuccess);
