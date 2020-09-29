document.querySelector("#burger").addEventListener("click", function () {
  let drawer = document.querySelector(".drawer");

  if (this.getAttribute("src")=="../assets/close.svg")
  {
    this.setAttribute("src", document.documentElement.getAttribute("data-theme")=="light" ? "../assets/burger.svg" : "../assets/burger-modo-noct.svg")
  }    
    else
  {
    this.setAttribute("src", document.documentElement.getAttribute("data-theme")=="light" ? "../assets/close.svg" : "../assets/close-modo-noct.svg")
  }
  drawer.classList.toggle("visible")
  
})
