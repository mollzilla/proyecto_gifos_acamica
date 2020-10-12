// const apiKey="VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn";
let offset=0;

let searchArgument=document.querySelector("#search-argument");

let favoritesButtonSm=document.querySelector("#favoritos-sm");
let favoritesButtonLg=document.querySelector("#favoritos-lg");

let misGifosSm=document.querySelector("#mis-gifos-sm");
let misGifosLg=document.querySelector("#mis-gifos-lg");

viewMore.style.display="none";
let noResults=document.querySelector("#no-results");

let searchInputValue=document.querySelector("#search-input");
let lastValue=searchInputValue.value;

let resultsGrid=document.querySelector('#results-grid');
resultsGrid.style.display="none";

function createOverlay(gifItem) {

  /* adds a child div to a gifItem positioned absolutely that behaves as an overlay, containing both icons and title */

    let overlay=document.createElement("div");
    overlay.classList.add("overlay");

    /* Icons */
    let actionIcons=document.createElement("div");
    actionIcons.classList.add("action-icons");

    let like=document.createElement("a");
    like.addEventListener('click', likeAction);

    let download=document.createElement("a");
    download.classList.add(gifItem.title ? gifItem.title.replaceAll(" ", "_") : "sin_titulo");
    download.addEventListener('click', downloadAction);

    let expand=document.createElement("a");


    

    [like, download, expand].forEach(a => {

      a.id=gifItem.id;
      a.classList.add("action-icon");
      
      if(a==like && (localStorage.getItem('favorites') && (localStorage.getItem('favorites').split(",")).includes(gifItem.id)))
      {
        a.style.backgroundImage="url(../../assets/icon_fav_active.svg)";
        a.style.width="30px";
        a.style.height="27px";
      }

      actionIcons.appendChild(a);
    });

    /* username and title*/

    let username=document.createElement("p");
    username.classList.add("username");
    username.textContent=gifItem.username || "Anon";

    let gifTitle=document.createElement("div");
    gifTitle.classList.add("gif-title");

    let title=document.createElement("p");
    title.classList.add("title");
    title.textContent=gifItem.title || "Sin nombre";

    /* Append to the overlayed div */

    gifTitle.appendChild(username);
    gifTitle.appendChild(title);
    
    overlay.appendChild(actionIcons);
    overlay.appendChild(gifTitle);
    return overlay;
  } 


function appendSearchResults(searchResults, container) {

  searchArgument.textContent=searchInputValue.value;

  let data = []
  if (searchResults.length==undefined)
    data.push(searchResults)
  else
    data=searchResults;

  data.forEach(result => {

    let resultGif=document.createElement("div");
    resultGif.classList.add("result-placeholder");
    resultGif.setAttribute('id', `result-item-${offset}`);
    resultGif.style.backgroundImage=`url("${result.images.fixed_width.url}")`;
    
    resultGif.appendChild(createOverlay(result));
    container.appendChild(resultGif);
    container.style.display="grid";

    offset++;
  });

suggestion.innerHTML="";
lastValue=searchInputValue.value;

/* uses navigation anchor to go to new result (last offset - pagination) */
// location.hash = "#" + `result-item-${offset-12}`;
}

ouch = () => {
  document.querySelector('#ouch-img').style.display="block";
  document.querySelector("#try-again").style.display="block";
  noResults.style.display="block";
}

async function search(e) {

  /* Three different values for let fetch depending on the need for an offset and the origin of the search parameter (view more/search/favorites) */

  e.preventDefault();
  let searchResults;

  // resultsGrid.style.display="none";
  let searchFetch;

  noResults.style.display="none";

  /*if the id of the first element path of the event clicked is view more, fetch will equal a paginated search with offset */

  if (e.path[0].id==viewMore.id)
  {
    searchFetch = await fetch(`https://api.giphy.com/v1/gifs/search?q=${searchInputValue.value}?&api_key=${apiKey}&limit=12&offset=${offset}`);
  }
  else if (e.path[0].id==favoritesButtonSm.id || e.path[0].id==favoritesButtonLg.id)
  {
    if (localStorage.getItem('favorites')!=null)
    {
      let queryString = localStorage.getItem("favorites").split(",").length==1  ?
                    (`https://api.giphy.com/v1/gifs/${localStorage.getItem("favorites")}?&api_key=${apiKey}`)
                   : (`https://api.giphy.com/v1/gifs?ids=${localStorage.getItem("favorites")}&api_key=${apiKey}`);

      searchFetch = await fetch(queryString);
      searchInputValue.value="Favoritos";
      resultsGrid.innerHTML="";
    }
    else
    {
      resultsGrid.innerHTML="";
      searchInputValue.value="Favoritos";
      let noFavorites=document.createElement("h3");
      searchArgument.textContent="Favoritos";
      noFavorites.textContent="¡Guarda tu primer GIFO en Favoritos para que se muestre aquí!";
      noFavorites.setAttribute("id", "no-favorites");
      document.querySelector(".find-favorites").appendChild(noFavorites);
      return;
    }
  }
  else if (e.path[0].id==misGifosSm.id || e.path[0].id==misGifosLg.id)
  {
    if (localStorage.getItem('myGifos')!=null)
    {
      let queryString = localStorage.getItem("myGifos").split(",").length==1  ?
                    (`https://api.giphy.com/v1/gifs/${localStorage.getItem("myGifos")}?&api_key=${apiKey}`)
                   : (`https://api.giphy.com/v1/gifs?ids=${localStorage.getItem("myGifos")}&api_key=${apiKey}`);

      searchFetch = await fetch(queryString);
      searchInputValue.value="Mis Gifos";
      resultsGrid.innerHTML="";
    }
    else
    {
      resultsGrid.innerHTML="";
      searchInputValue.value="Favoritos";
      let noFavorites=document.createElement("h3");
      searchArgument.textContent="Favoritos";
      noFavorites.textContent="INSERTAR TEXTO DE NO TENER GIFOS";
      noFavorites.setAttribute("id", "no-favorites");
      document.querySelector(".find-favorites").appendChild(noFavorites);
      return;
    }
  }
  else
  {
    offset=0;

    searchFetch = await fetch(`https://api.giphy.com/v1/gifs/search?q=${searchInputValue.value}&api_key=${apiKey}&limit=12`);
    resultsGrid.innerHTML="";
  }

  searchResults = await searchFetch.json();

  await appendSearchResults(searchResults.data, resultsGrid);

  viewMore.style.display= searchResults.pagination &&
                          searchResults.pagination.total_count>offset ? "block" : "none";

  if (searchResults.pagination && searchResults.pagination.total_count==0)
    ouch();
}

[searchIcon, favoritesButtonSm, favoritesButtonLg, misGifosSm, misGifosLg, viewMore].forEach(button =>  button.addEventListener('click', e => search(e)));