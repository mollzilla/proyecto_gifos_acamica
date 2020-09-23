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
  favorites();
}

async function favorites() {


const queryString= localStorage.getItem("favorites").split(",").length==1  ?
                    (`https://api.giphy.com/v1/gifs/${localStorage.getItem("favorites")}?api_key=${apiKey}`)
                    : (`https://api.giphy.com/v1/gifs?ids=${localStorage.getItem("favorites")}?&api_key=${apiKey}`)
console.log(queryString)
  const favoritesFetch = await fetch(queryString);
  const data = await favoritesFetch.json();
  console.log(data);
}

