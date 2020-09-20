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

  e.preventDefault();
  let searchResults;

  resultsGrid.style.display="none";

  noResults.style.display="none";

  if (e.path[0].id==submitButton.id) {
    offset=0;

    const searchFetch= await fetch(`https://api.giphy.com/v1/gifs/search?q=${searchInputValue.value}?&api_key=${apiKey}&limit=12`);
    searchResults = await searchFetch.json();
    resultsGrid.innerHTML="";
    appendSearchResults();
    viewMore.style.display="block";
  }
  else
  {
    const searchFetch= await fetch(`https://api.giphy.com/v1/gifs/search?q=${searchInputValue.value}?&api_key=${apiKey}&limit=12&offset=${offset}`);
    searchResults = await searchFetch.json();
    appendSearchResults();
    viewMore.style.display="block";
  }

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

      // let resultGif=document.createElement('img');
      
      // resultGif.setAttribute("src", result.images.fixed_width.url);

      // resultGif.classList.add("result-gif")

      // resultsGrid.appendChild(resultGif);

      let resultGif=document.createElement("div");
      resultGif.classList.add("result-placeholder");
      resultGif.setAttribute('id', `result-item-${offset}`)
      resultGif.style.backgroundImage=`url("${result.images.fixed_width.url}")`
      resultsGrid.appendChild(resultGif)

      offset++;
    });
 
  }
  suggestion.innerHTML="";
  lastValue=searchInputValue.value;

  console.log(searchResults);
};

submitButton.addEventListener('click', (e => search(e)));
viewMore.addEventListener('click', e => search(e));



