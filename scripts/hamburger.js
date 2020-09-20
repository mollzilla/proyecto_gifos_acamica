menu=document.getElementById("menu-ul");
toggle=document.querySelector('.menu');

toggle.addEventListener('click', function() {
  if(menu.classList.contains("active")) {
    console.log("true")
    menu.classList.remove("active");
  } else {
    console.log("false")
    menu.classList.add("active")
  }
});

