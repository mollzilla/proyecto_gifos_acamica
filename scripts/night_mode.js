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
    allIcons.map(icon => icon.setAttribute('src', `/assets/${icon.id}_modo_noc.svg`))
    console.log(allIcons)

    document.querySelector("#burger").setAttribute("src", "/assets/icon_close_modo_noc.svg");
  }
  else if(document.documentElement.getAttribute("data-theme")=="dark")
  {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggleLinkSm.textContent="Modo Nocturno";
    themeToggleLinkLg.textContent="Modo Nocturno";
    allIcons.map(icon => icon.setAttribute('src', `assets/${icon.id}.svg`))

    document.querySelector("#burger").setAttribute("src", "assets/icon_close.svg");
  }

  // iconColorManager();

};

let trans = () => {
  document.documentElement.classList.add("themeTransition");
  window.setTimeout( () => {
    document.documentElement.classList.remove("themeTransition")
  }, 1000)
}