// const apiKey="VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn";
let offset=0;

let submitButton=document.querySelector("#submit");
let viewMore=document.querySelector("#view-more");
viewMore.style.display="none";
let noResults=document.querySelector("#no-results");


let searchInputValue=document.querySelector("#search-input");
let resultsGrid=document.querySelector('#results-grid');

let tryAgain=document.querySelector("#try-again");
let ouchImg=document.querySelector('#ouch-img');

let lastValue=searchInputValue.value;

async function search(e) {

  e.preventDefault();
  let searchResults;

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
    }

    searchResults.data.forEach(result => {
      let resultItem=document.createElement('div');
      resultItem.setAttribute('id', `result-item-${offset}`)
      resultItem.setAttribute('class', 'result-item')

      let resultGif=document.createElement('iframe');
      resultGif.setAttribute("src", result.embed_url);

      resultItem.appendChild(resultGif);
      resultsGrid.appendChild(resultItem);

      offset++;
    });
 
  }
  suggestion.innerHTML="";
  lastValue=searchInputValue.value;

  console.log(searchResults);
};

submitButton.addEventListener('click', (e => search(e)));
viewMore.addEventListener('click', e => search(e));



