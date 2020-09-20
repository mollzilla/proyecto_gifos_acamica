
//Agregar bordes al logo.
let logo = document.getElementById('logo');
//Agrego el evento "mouseover".
logo.addEventListener("mouseover", () => {
    //Cuando colocamos el mouse sobre el logo agrego estilo la borde.
    logo.style.border = "3px solid black";
});
//Los quito cuando sale.
logo.addEventListener("mouseout", () => {
    logo.style.border = "";
});


//Cambiar titulo y guardar

//Funciona con innerText, con innerHTML y textContent.
let title = document.getElementById('title');
//Cuando hacemos click sobre el titulo entra en la función.
title.addEventListener('click', () => {
    //Le pido el nuevo título, lo guardo como el texto de mi id title y en localStorage "Key='title' Value='textContent'".
    title.textContent = prompt("Ingrese título.");
    localStorage.setItem("title", title.textContent);
});
//Si mi localStorage tiene un valor en el key 'title', entonces el titulo de la página será ese valor.
if (localStorage.getItem("title")) {
    title.textContent = localStorage.getItem("title");
}


//Clonar la ultima sección.[CORREGIDO].
//Cuando cliqueamos en el botón entra en la función.
let btn = document.getElementById("btn").addEventListener('click', () => {
    //Mi variable con id de la sección a clonar...
    let addWidget = document.getElementById("widget");
    //Y después de esa sección a clonar(.after), los clonamos con 
    //miSecciónAClonar.cloneNode(ture)
    addWidget.after(addWidget.cloneNode(true));
});