function login(){

let casa = document.getElementById("domicilio").value

let pass = document.getElementById("password").value

if(pass === "1234"){

localStorage.setItem("casa", casa)

window.location = "dashboard.html"

}else{

alert("Contraseña incorrecta")

}

}
