localStorage.removeItem('favorites')

function likeAction(e) {
  e.preventDefault();

  if(!localStorage.getItem('favorites'))
  {
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
  }
}
