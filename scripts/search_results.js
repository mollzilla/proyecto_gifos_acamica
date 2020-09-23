// const apiKey="VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn";
let offset=0;

let submitButton=document.querySelector("#search-icon");
let viewMore=document.querySelector("#view-more");
viewMore.style.display="none";
let noResults=document.querySelector("#no-results");


let searchInputValue=document.querySelector("#search-input");
let resultsGrid=document.querySelector('#results-grid');
resultsGrid.style.display="none";

let tryAgain=document.querySelector("#try-again");
let ouchImg=document.querySelector('#ouch-img');

let lastValue=searchInputValue.value;

async function search(e) {

  /* Two different values for let fetch depending on the need for an offset (view more clicked) */

  e.preventDefault();
  let searchResults;

  resultsGrid.style.display="none";
  let searchFetch;

  noResults.style.display="none";

  /*if the id of the first element path of the event clicked is view more, fetch will equal a paginated search with offset */
  if (e.path[0].id==viewMore.id)
  {
    searchFetch= await fetch(`https://api.giphy.com/v1/gifs/search?q=${searchInputValue.value}?&api_key=${apiKey}&limit=12&offset=${offset}`);
  }
  else
  {
    offset=0;

    searchFetch= await fetch(`https://api.giphy.com/v1/gifs/search?q=${searchInputValue.value}?&api_key=${apiKey}&limit=12`);
    resultsGrid.innerHTML="";
  }
    searchResults = await searchFetch.json();
    viewMore.style.display="block";
    appendSearchResults();


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

      let expand=document.createElement("a");

      [like, download, expand].forEach(a => {

        a.id=gifItem.id;
        a.classList.add("action-icon");

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

    /* 
   

  /* appending search results to the grid */
  
  function appendSearchResults() {
    let searchArgument=document.querySelector("#search-argument");
    searchArgument.textContent=searchInputValue.value;

    if(searchResults.data.length==0)
    {
      ouchImg.style.display="block";
      tryAgain.style.display="block";
      noResults.style.display="block";
    } else {
      resultsGrid.style.display="grid";
    }

    searchResults.data.forEach(result => {

      let resultGif=document.createElement("div");
      resultGif.classList.add("result-placeholder");
      resultGif.setAttribute('id', `result-item-${offset}`);
      resultGif.style.backgroundImage=`url("${result.images.fixed_width.url}")`;
      
      resultGif.appendChild(createOverlay(result));

      resultsGrid.appendChild(resultGif);

      offset++;
    });
 
    suggestion.innerHTML="";
    lastValue=searchInputValue.value;
  
    /* uses navigation anchor to go to new result (last offset - pagination) */
    location.hash = "#" + `result-item-${offset-12}`;
  }

};

submitButton.addEventListener('click', (e => search(e)));
viewMore.addEventListener('click', e => search(e));



