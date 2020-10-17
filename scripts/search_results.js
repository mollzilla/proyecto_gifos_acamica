// localStorage.clear()

// const apiKey="VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn";
let offset=0;

let favoritesButtonSm=document.querySelector("#favoritos-sm");
let favoritesButtonLg=document.querySelector("#favoritos-lg");

let misGifosSm=document.querySelector("#mis-gifos-sm");
let misGifosLg=document.querySelector("#mis-gifos-lg");

let searchInputValue=document.querySelector("#search-input");
let lastValue=searchInputValue.value;

let borderBar=document.querySelector("#border-bar");
let resultsGrid=document.querySelector('#results-grid');

let collections = Array.from(document.querySelectorAll(".collection"));
let emptyFavorites=document.querySelector("#empty-favorites");
let emptyMisGifos=document.querySelector("#empty-mis-gifos");

[resultsGrid, viewMore].map(x => x.style.display="none");

function hideTop() {
  [document.querySelector("h1"), document.querySelector(".search"), searchArgument].forEach(x => x.style.display="none");
}

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
    expand.addEventListener('click', expandAction);

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
    overlay.style.zIndex=1000;
    return overlay;
  } 


function appendSearchResults(searchResults, container) {

  searchArgument.textContent=searchInputValue.value;
  searchArgument.style.display = "block";
  [document.querySelector(".trending-stuff-title"), trendingStuff].map(x => x.style.display="none");

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
  resultsGrid.display="none";
  [borderBar, document.querySelector(".trending-stuff-title"), trendingStuff, searchArgument, document.querySelector('#no-results'), document.querySelector('#ouch-img'), document.querySelector("#try-again")].map(x => x.style.display = "block");
}

async function search(pathId) {

  /* Three different values for let fetch depending on the need for an offset and the origin of the search parameter (view more/search/favorites) */
  // e.preventDefault();
  let searchResults;
  let searchFetch;

  /* get rid of favorites and myGifos, if any */
  collections.map(x => x.style.display="none");

  [document.querySelector('#no-results'), document.querySelector('#ouch-img'), document.querySelector("#try-again")].map(x => x.style.display = "none");

  /*if the id of the first element path of the event clicked is view more, fetch will equal a paginated search with offset */

  if (pathId==viewMore.id) /* next results in a search with a >12 offset*/
  {
    searchFetch = await fetch(`https://api.giphy.com/v1/gifs/search?q=${searchInputValue.value}?&api_key=${apiKey}&limit=12&offset=${offset}`);
  }
  else if (pathId==favoritesButtonSm.id || pathId==favoritesButtonLg.id) /* favorites */
  {
    document.querySelector(".favoritos").style.display="block";
    hideTop();
    searchArgument.style.display="none";
    if (localStorage.getItem('favorites')!=null && localStorage.getItem('favorites')!="") // no uso falsies por seguridad
    {
      let queryString = localStorage.getItem("favorites").split(",").length==1  ?
                    (`https://api.giphy.com/v1/gifs/${localStorage.getItem("favorites")}?&api_key=${apiKey}`)
                   : (`https://api.giphy.com/v1/gifs?ids=${localStorage.getItem("favorites")}&api_key=${apiKey}`);
      searchFetch = await fetch(queryString);
      resultsGrid.innerHTML="";
    }
    else
    {
      emptyFavorites.style.display="flex";
      resultsGrid.style.display="none";
      return;
    }
  }
  else if (pathId==misGifosSm.id || pathId==misGifosLg.id) /* mis-gifos */
  {
    document.querySelector(".mis-gifos").style.display="block";
    hideTop();
    if (localStorage.getItem('myGifos')!=null && localStorage.getItem('myGifos')!="") // no uso falsies por seguridad
    {
      let queryString = localStorage.getItem("myGifos").split(",").length==1  ?
                    (`https://api.giphy.com/v1/gifs/${localStorage.getItem("myGifos")}?&api_key=${apiKey}`)
                   : (`https://api.giphy.com/v1/gifs?ids=${localStorage.getItem("myGifos")}&api_key=${apiKey}`);

      searchFetch = await fetch(queryString);
      resultsGrid.innerHTML="";
    }
    else
    {
      resultsGrid.style.display="none";
      emptyMisGifos.style.display="flex";
      return;
    }
  }
  else /* first regular search */
  {
    offset=0;

    searchFetch = await fetch(`https://api.giphy.com/v1/gifs/search?q=${searchInputValue.value}&api_key=${apiKey}&limit=12`);
    resultsGrid.innerHTML="";
  }

  searchResults = await searchFetch.json();

  if (searchResults.pagination && searchResults.pagination.total_count==0)
    ouch();

  await appendSearchResults(searchResults.data, resultsGrid);

  viewMore.style.display= searchResults.pagination &&
                          searchResults.pagination.total_count>offset ?
                          "block" : "none";

  
  if([favoritesButtonSm.id, favoritesButtonLg.id, misGifosSm.id, misGifosLg.id].find(x=> x==pathId)!=undefined) /* hide searchArgument and bar */
    [searchArgument, borderBar].map(x => x.style.display=="none")
    
}

[searchIcon, favoritesButtonSm, favoritesButtonLg, misGifosSm, misGifosLg, viewMore].forEach(button =>  button.addEventListener('click', e => {
  e.preventDefault();
  search(e.path[0].id);
  })
);