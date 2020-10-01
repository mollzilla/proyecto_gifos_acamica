

document.querySelector("#burger").addEventListener("click", function () {
  let drawer = document.querySelector(".drawer");
  if (this.getAttribute("src")=="../assets/close.svg" || this.getAttribute("src")=="../assets/close-modo-noct.svg")
  {
    if(document.documentElement.getAttribute("data-theme")=="light")
      this.setAttribute("src", "../assets/burger.svg");
    else
      this.setAttribute("src", "../assets/burger-modo-noct.svg");
  } else
  {

    if(document.documentElement.getAttribute("data-theme")=="light")
      this.setAttribute("src", "../assets/close.svg");
    else
      this.setAttribute("src", "../assets/close-modo-noct.svg");
  }

  drawer.classList.toggle("visible");

});