document.querySelector("#burger").addEventListener("click", function () {
  let drawer = document.querySelector(".drawer");

  if (this.getAttribute("src")=="./assets/close.svg")
    this.setAttribute("src", "./assets/burger.svg")
  else
    this.setAttribute("src", "./assets/close.svg")

  drawer.classList.toggle("visible")
  



})