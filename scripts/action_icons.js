// localStorage.removeItem('favorites'); // for testing purposes

let allIcons = Array.from(document.querySelectorAll('[id^="icon"]'));

var hoverIcons=allIcons.filter(icon => icon.id.match(/close|search/)==null);

hoverIcons=hoverIcons.map(icon => {
  icon.addEventListener('mouseover', () => icon.setAttribute('src', `assets/${icon.id}_hover.svg`));
  icon.addEventListener('mouseout', () => icon.setAttribute('src', `assets/${icon.id}.svg`));
})

let anchorIcons=Array.from(document.querySelectorAll("nav a"));

anchorIcons.map(function(icon)  { // Listen if active, set src otherwise
  icon.addEventListener('mouseup', () => icon.setAttribute('src', `assets/${icon.id}_hover.svg`))
});

document.querySelector(".logo").addEventListener("click", (e => {
  window.location.replace("index.html");
}))


function likeAction(e) {
  e.preventDefault();
  this.style.backgroundImage="url(../../assets/icon_fav_active.svg)";
  this.style.width="30px";
  this.style.height="27px";

  if(!localStorage.getItem('favorites'))
  {
    this.id=[this.id]
    localStorage.setItem("favorites", this.id);
  }
  else
  {
    let favorites=localStorage.getItem('favorites').split(",");
    
    if(!favorites.includes(this.id))
    {
      favorites.push(this.id);
      localStorage.setItem("favorites", favorites.toString(", "));
    }
    else
    {
      favorites=favorites.filter(favorite => favorite!=this.id)
      localStorage.setItem("favorites", favorites.toString(", "));
      this.style.backgroundImage="url(../../assets/icon_fav.svg)";
      this.style.width="32px";
      this.style.height="32px";
    }
  }
}

function expandAction(e) {
  e.preventDefault();
  console.log(e.path[3])
  console.log("mili")
  let mili=(e.path[3]).cloneNode(false)
  console.log(mili)

  mili.style.position="fixed";
  mili.style.top=0;
  mili.style.height="100vh"
  mili.style.width="100vw"
  mili.style.backgroundSize="contain"
  mili.style.backgroundRepeat="no-repeat"
  mili.classList.add("expandable")
  document.querySelector("header").appendChild(mili)
}

async function downloadAction() {

  let a = document.createElement('a');
  // get image as blob

  let response = await fetch(`https://media2.giphy.com/media/${this.id}/giphy.gif?${apiKey}&rid=giphy.gif`);
  let file = await response.blob();
  // use download attribute https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#Attributes
  a.download = `${this.classList[0]}`;
  a.href = window.URL.createObjectURL(file);
  //store download url in javascript https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes#JavaScript_access
  a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
  //click on element to start download
  a.click()
}

function copyURLAction() {
  console.log("copy url")
}

