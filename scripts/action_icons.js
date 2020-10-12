// localStorage.removeItem('favorites'); // for testing purposes

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
  console.log("mili")
  resultGif.classList.add('expandable');
}

async function downloadAction() {
  //create new a element
  let a = document.createElement('a');
  // get image as blob
  // let response = await fetch('https://media2.giphy.com/media/DvyLQztQwmyAM/giphy.gif?cid=e9ff928175irq2ybzjyiuicjuxk21vv4jyyn0ut5o0d7co50&rid=giphy.gif');
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

var hoverIcons=allIcons.filter(icon => icon.id.match(/close|search/)==null);

hoverIcons=hoverIcons.map(icon => {

  icon.addEventListener('mouseover', () => icon.setAttribute('src', `assets/${icon.id}_hover.svg`));
  icon.addEventListener('mouseout', () => icon.setAttribute('src', `assets/${icon.id}.svg`));
})

let anchorIcons=Array.from(document.querySelectorAll("nav a"));

anchorIcons.map(function(icon)  { // Listen if active, set src otherwise
  icon.addEventListener('mouseup', () => icon.setAttribute('src', `assets/${icon.id}_hover.svg`))
});