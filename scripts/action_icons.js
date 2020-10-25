// localStorage.removeItem('favorites'); // for testing purposes

let allIcons = Array.from(document.querySelectorAll('[id^="icon"]'));

var hoverIcons = allIcons.filter(icon => icon.id.match(/close|search/) == null);

hoverIcons = hoverIcons.map(icon => {
  icon.addEventListener('mouseover', () => icon.setAttribute('src', `assets/${icon.id}_hover.svg`));
  icon.addEventListener('mouseout', () => icon.setAttribute('src', `assets/${icon.id}.svg`));
})

let anchorIcons = Array.from(document.querySelectorAll("nav a"));

anchorIcons.map(function (icon) { // Listen if active, set src otherwise
  icon.addEventListener('mouseup', () => icon.setAttribute('src', `assets/${icon.id}_hover.svg`))
});

document.querySelector(".logo").addEventListener("click", (e => {
  window.location.replace("index.html");
}))


/* checks whether favorite exists in localstorage, removes or adds, according to condition */
function likeAction(e) {
  e.preventDefault();
  this.style.backgroundImage = "url(./assets/icon_fav_active.svg)";
  this.style.width = "30px";
  this.style.height = "27px";

  if (!localStorage.getItem('favorites')) {
    this.id = [this.id]
    localStorage.setItem("favorites", this.id);
  }
  else {
    let favorites = localStorage.getItem('favorites').split(",");

    if (!favorites.includes(this.id)) {
      favorites.push(this.id);
      localStorage.setItem("favorites", favorites.toString(", "));
    }
    else {
      favorites = favorites.filter(favorite => favorite != this.id)
      localStorage.setItem("favorites", favorites.toString(", "));
      this.style.backgroundImage = "url(./assets/icon_fav.svg)";
      this.style.width = "32px";
      this.style.height = "32px";
    }
  }
}

// bind close icon fullscreen view 

if (document.querySelector("#close-expanded-view")) {
  document.querySelector("#close-expanded-view").addEventListener("click", () => {
    document.querySelector(".fullscreen-view").style.display="none";
    document.querySelector("body").classList.remove("no-scroll");
  });
}

function expandAction(e) {
  e.preventDefault();

  document.querySelector(".fullscreen-view").style.display="flex";
  document.querySelector("body").classList.add("no-scroll");

  console.log(e.path[0].classList[0])

  if(e.path[0].classList[0]=="action-icon") // another option would bt if(getComputedStyle(e.path[0], null).display=="block")
  {
    document.querySelector(".fullscreen-gif").style.backgroundImage=e.path[3].style.backgroundImage;

    document.querySelector(".expanded-username").textContent=e.path[3].children[0].children[1].children[0].textContent;
    document.querySelector(".expanded-title").textContent=textContent=e.path[3].children[0].children[1].children[1].textContent;
  }
  else{
    
    document.querySelector(".fullscreen-gif").style.backgroundImage=e.path[1].style.backgroundImage;

    document.querySelector(".expanded-username").textContent=e.path[1].children[0].children[1].children[0].textContent;
    document.querySelector(".expanded-title").textContent=textContent=e.path[1].children[0].children[1].children[1].textContent;
  }
  
  let like= document.querySelector(".expanded-like-action");

  if((localStorage.getItem('favorites') && (localStorage.getItem('favorites').split(",")).includes(e.path[0].id)))
  {
    like.style.backgroundImage="url(./assets/icon_fav_active.svg)";
    like.style.width="30px";
    like.style.height="27px";
  }

  like.addEventListener('click', likeAction);
  let download=document.querySelector(".expanded-download-action");
  download.addEventListener('click', downloadAction);

  [like, download].forEach(a => a.id=e.path[0].id); // ad gif id for function purposes avoiding parameters
  }

async function downloadAction() {
// e.preventDefault()
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

async function copyURLAction(e) {

  navigator.clipboard.writeText(`https://media2.giphy.com/media/${e.path[0].id}/giphy.gif?${apiKey}&rid=giphy.gif`).then(
    console.log("success"))
    .then(() => alert("Link de tu GIFO copiado al portapapeles"))
    .catch(err => console.log(err))
}

function removeAction(e) {

  /* removes gif from localstorage and also card from my gifos view. there is no api meant to remove a gif */
  myGifos = localStorage.getItem("myGifos").split(",");
  myGifos = myGifos.filter(myGifo => myGifo != this.id)
  localStorage.setItem("myGifos", myGifos.toString(", "));
  e.path[3].remove()
}