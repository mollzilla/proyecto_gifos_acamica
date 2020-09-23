localStorage.removeItem('favorites')

function likeAction(e) {
  e.preventDefault();

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
  }
}
