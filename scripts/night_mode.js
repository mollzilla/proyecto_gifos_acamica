let themeToggleLinkSm = document.querySelector("#modo-nocturno-sm");
let themeToggleLinkLg = document.querySelector("#modo-nocturno-lg");

themeToggleLinkSm.addEventListener("click", (e) => themeToggler(e));
themeToggleLinkLg.addEventListener("click", (e) => themeToggler(e));


function themeToggler(e) {
  e.preventDefault();
  trans();
  if(document.documentElement.getAttribute("data-theme")=="light")
  {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggleLinkSm.textContent="Modo Diurno";
    themeToggleLinkLg.textContent="Modo Diurno";

  }
  else if(document.documentElement.getAttribute("data-theme")=="dark")
  {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggleLinkSm.textContent="Modo Nocturno";
    themeToggleLinkLg.textContent="Modo Nocturno";
  }
    
};

let trans = () => {
  document.documentElement.classList.add("themeTransition");
  window.setTimeout( () => {
    document.documentElement.classList.remove("themeTransition")
  }, 1000)
}