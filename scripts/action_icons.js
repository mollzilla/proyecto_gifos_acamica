localStorage.removeItem('favorites')

function likeAction(e) {
  e.preventDefault();
  this.style.backgroundImage="url(../../assets/icon-fav-active.svg)";
  this.style.width="30px";
  this.style.height="27px";

  if(!localStorage.getItem('favorites'))
  {
    this.id=[this.id]
    localStorage.setItem("favorites", this.id);
    console.log(localStorage.getItem('favorites'))
  }
  else
  {
    let favorites=localStorage.getItem('favorites').split(",");
    
    if(!favorites.includes(this.id))
    {
      favorites.push(this.id);
      localStorage.setItem("favorites", favorites.toString(", "));
      console.log(localStorage.getItem('favorites'))
    }
    else
    {
      favorites=favorites.filter(favorite => favorite!=this.id)
      localStorage.setItem("favorites", favorites.toString(", "));
      this.style.backgroundImage="url(../../assets/icon-fav.svg)";
      this.style.width="32px";
      this.style.height="32px";
    }
  }
}
