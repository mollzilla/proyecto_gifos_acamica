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

[resultsGrid, viewMore, viewMoreFavorites, viewMoreMyGifos].map(x => x.style.display="none");

function hideTop() {
  [document.querySelector("h1"), document.querySelector(".search"), searchArgument].forEach(x => x.style.display="none");
}

function createOverlay(gifItem, pathId) {

  /* adds a child div to a gifItem positioned absolutely that behaves as an overlay, containing both icons and title */
console.log(pathId)
    let overlay=document.createElement("div");
    overlay.classList.add("overlay");

    /* Icons */
    let actionIcons=document.createElement("div");
    actionIcons.classList.add("action-icons");

    let myGifosActionIcons=document.createElement("div");
    myGifosActionIcons.classList.add("action-icons", "my-gifos-action-icons");

    let like=document.createElement("a");
    like.addEventListener('click', likeAction);
    like.classList.add("like-action")
    
    let expand=document.createElement("a");
    let myGifosExpand=document.createElement("a");
    [expand, myGifosExpand].forEach(a => {
      a.addEventListener('click', expandAction);
    });

    let download=document.createElement("a");
    let myGIfosDownload=document.createElement("a");
    [download, myGIfosDownload].forEach(a => {
      a.classList.add(gifItem.title ? gifItem.title.replaceAll(" ", "_") : "sin_titulo");
      a.addEventListener('click', downloadAction);
    });

    let remove=document.createElement("a");
    remove.classList.add("remove-action")
    remove.addEventListener('click', removeAction);

    actionIcons.appendChild(like);
    myGifosActionIcons.appendChild(remove);

    [like, download, myGIfosDownload, expand, myGifosExpand, remove].forEach(a => {

      a.id=gifItem.id;
      a.classList.add("action-icon");
      
      if(a==like && (localStorage.getItem('favorites') && (localStorage.getItem('favorites').split(",")).includes(gifItem.id)))
      {
        a.style.backgroundImage="url(./assets/icon_fav_active.svg)";
        a.style.width="30px";
        a.style.height="27px";
      }
    });

    [like, download, expand].forEach(a => actionIcons.appendChild(a));
    [remove, myGIfosDownload, myGifosExpand].forEach(a =>{
       myGifosActionIcons.appendChild(a);
       a.classList.add("my-gifos-action-icon")
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
    
    if (pathId==misGifosSm.id || pathId==misGifosLg.id || pathId==viewMoreMyGifos.id)
      overlay.appendChild(myGifosActionIcons)
    else
      overlay.appendChild(actionIcons);

    overlay.appendChild(gifTitle);

    overlay.style.zIndex=1000;
    return overlay;
  } 


function appendSearchResults(searchResults, container, pathId) {

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
    
    resultGif.appendChild(createOverlay(result, pathId));
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

// [resultsGrid, viewMore, viewMoreFavorites, viewMoreMyGifos].map(x => x.style.display="none");
async function search(pathId) {

  /* Three different values for let fetch depending on the need for an offset and the origin of the search parameter (view more/search/favorites) */
  // e.preventDefault();
  let searchResults;
  let searchFetch;
  let currentSection;

  /* get rid of favorites and myGifos, if any */
  collections.map(x => x.style.display="none");

  [document.querySelector('#no-results'), document.querySelector('#ouch-img'), document.querySelector("#try-again")].map(x => x.style.display = "none");

  /*if the id of the first element path of the event clicked is view more, fetch will equal a paginated search with offset */

  if (pathId==viewMore.id) /* next results in a search with a >12 offset*/
  {  
    searchFetch = await fetch(`https://api.giphy.com/v1/gifs/search?q=${searchInputValue.value}?&api_key=${apiKey}&limit=12&offset=${offset}`);
  }
  else if (pathId==favoritesButtonSm.id || pathId==favoritesButtonLg.id || pathId==viewMoreFavorites.id ) /* favorites */
  {    
    if (pathId!=viewMoreFavorites.id) {
      resultsGrid.innerHTML="";
      offset=0;
      [resultsGrid, viewMore, viewMoreFavorites, viewMoreMyGifos].map(x => x.style.display="none");
    }

    document.querySelector(".favoritos").style.display="block";
    hideTop();
    searchArgument.style.display="none";

    if (localStorage.getItem('favorites')!=null && localStorage.getItem('favorites')!="") // no uso falsies por seguridad
    {
      let favorites=localStorage.getItem("favorites").split(",");
       // need to paginate
      viewMoreFavorites.style.display = favorites.length-offset>12 ? "block" : "none"; // show view more button in case of more than 12 remaining results

      const queryString=getQueryParameters("favorites", offset)
      searchFetch = await fetch(queryString); // await fetch funciton()
    }
    else // LocalStorage has no favorites, show empty favorites message
    {
      emptyFavorites.style.display="flex";
      [resultsGrid, borderBar].map(x => x.style.display="none");
      return;
    }
  }
  else if (pathId==misGifosSm.id || pathId==misGifosLg.id || pathId==viewMoreMyGifos.id) /* mis-gifos */
  {
    // navitates to the section (not triggered by view more)
    if (pathId!=viewMoreMyGifos.id) {
      offset=0;
      resultsGrid.innerHTML="";
      [resultsGrid, viewMore, viewMoreFavorites, viewMoreMyGifos].map(x => x.style.display="none");
    }

    document.querySelector(".mis-gifos").style.display="block";
    hideTop();
    searchArgument.style.display="none";

    if (localStorage.getItem('myGifos')!=null && localStorage.getItem('myGifos')!="") // no uso falsies por seguridad
    {

      let myGIfos=localStorage.getItem("myGifos").split(",");

      viewMoreMyGifos.style.display = myGIfos.length-offset>12 ? "block" : "none"; // show view more button in case of more than 12 remaining results

      const queryString=getQueryParameters("myGifos", offset)
      searchFetch = await fetch(queryString); // await fetch funciton(
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
    currentSection="search";
    offset=0;

    searchFetch = await fetch(`https://api.giphy.com/v1/gifs/search?q=${searchInputValue.value}&api_key=${apiKey}&limit=12`);
    resultsGrid.innerHTML="";
    borderBar.style.display="block";
  }

  searchResults = await searchFetch.json();

  if (searchResults.pagination && searchResults.pagination.total_count==0)
    ouch();

  await appendSearchResults(searchResults.data, resultsGrid, pathId);

  // console.log(localStorage.getItem("favorites").split(",").length - localStorage.getItem("favorites").split(",").slice(offset, 12).length)

  if (currentSection=="search") // case of pagination provided by API response
    viewMore.style.display = searchResults.pagination && searchResults.pagination.total_count>offset ? "block" : "none";
  
  if([favoritesButtonSm.id, favoritesButtonLg.id, misGifosSm.id, misGifosLg.id].find(x=> x==pathId)!=undefined) /* hide searchArgument and bar */
    [searchArgument, borderBar].map(x => x.style.display="none")
 
}

[searchIcon, searchIconSm, favoritesButtonSm, favoritesButtonLg, misGifosSm, misGifosLg, viewMore, viewMoreFavorites, viewMoreMyGifos].forEach(button =>  button.addEventListener('click', e => {
  e.preventDefault();
  search(e.path[0].id);
  })
);

const getQueryParameters = (key, offset) => {
  const items=localStorage.getItem(key).split(",");
  let parameters;
  const pageSize=12;

  if(items.length-offset>0)
  {
    parameters=items.slice(offset, offset+pageSize);
  } else
  {
    if (items.length==1)
      parameters=localStorage.getItem(key)
    else 
      parameters=items.slice(0,pageSize);
  }

  let queryString = items.length==1  ?
                    (`https://api.giphy.com/v1/gifs/${parameters}?&api_key=${apiKey}`)
                   : (`https://api.giphy.com/v1/gifs?ids=${parameters}&api_key=${apiKey}`);

  return queryString;
}