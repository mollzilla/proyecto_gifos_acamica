

document.querySelector("#burger").addEventListener("click", function () {
  let drawer = document.querySelector(".drawer");
  if (this.getAttribute("src")=="./assets/icon_close.svg" || this.getAttribute("src")=="./assets/icon_close_modo_noc.svg")
  {
    
    if(document.documentElement.getAttribute("data-theme")=="light")
      this.setAttribute("src", "./assets/burger.svg");
    else
      this.setAttribute("src", "./assets/burger-modo-noct.svg");
  } else
  {
    if(document.documentElement.getAttribute("data-theme")=="light")
      this.setAttribute("src", "./assets/icon_close.svg");
    else
      this.setAttribute("src", "./assets/icon_close_modo_noc.svg");
  }

  drawer.classList.toggle("visible");

});