let mainTitle=document.querySelector("h1");
let searchSection=document.querySelector(".search");
let trending=document.querySelector(".trending");
let viewMore=document.querySelector("#view-more");
let createContainer = document.querySelector(".create");

document.querySelector(".logo").addEventListener("click", () => {
  console.log("mili")
  document.querySelector(".search-results").style.display="block";
  [mainTitle, searchSection].map(x => x.style.display="block");
  [createContainer, resultsGrid, viewMore].map(x => x.style.display="none");
  trending.style.display="flex"
  searchArgument.textContent="";
})

let allIcons=Array.from(document.querySelectorAll('[id^="icon"]'));

/* API */
const apiKey="VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn";

async function appendTrendings() {

    async function getTrendings() {
      try {
        const [trendingKeyWords, trendingGifs] = await Promise.all([
          fetch(`https://api.giphy.com/v1/trending/searches?&api_key=${apiKey}`),
          fetch(`https://api.giphy.com/v1/gifs/trending?&api_key=${apiKey}`),
        ]);
        const trendingkeyWordsData = await trendingKeyWords.json();
        const trendingGifsData = await trendingGifs.json();

        return [trendingkeyWordsData, trendingGifsData]

      } catch (err) {
        console.log(err);
      }
    }

  let content = await getTrendings();
  let trendingStuff=document.querySelector(".trending-stuff");

  appendSearchResults((content[1].data.splice(0,10)), carousel);

  content[0].data.forEach((word, i) => {

    if(i>4)
      return

    let span=document.createElement("span");

    span.textContent = word==content[content.length-1] ? word : `${word}, `;
    trendingStuff.appendChild(span);

    span.addEventListener("click", (e) => { 
      searchInput.value=span.textContent.replace(", ", "");
      search(e);
    }); 
  });
}

appendTrendings();

let searchContainer=document.querySelector(".search-border");

let searchInput=document.querySelector("#search-input");

let suggestion=document.createElement('div');


  let closeIcon=document.querySelector("#icon_close");
  let searchIcon=document.querySelector("#icon_search");

  let laData;

  searchInput.addEventListener('keyup', async function (e) {

    try {

      if (e.keyCode === 13)
      {
        e.stopPropagation();
        search(e);
        return;
      }
        
      suggestion.innerHTML="";
      
      if(this.value.trim()=="")
        {
          searchIcon.style.display="inline";
          closeIcon.style.display="none";
          return;
        }


      const elFetch = await fetch(`https://api.giphy.com/v1/gifs/search/tags?q=${this.value}?&api_key=${apiKey}`);
      laData = await elFetch.json();

      // searchIcon.style.display="none";
      searchIcon.style.transform="translate(-2250%, 10%)"
      closeIcon.style.display="initial";

      closeIcon.addEventListener('click', function() {
        searchInput.value="";
        searchIcon.style.display="initial";
        this.style.display="none";
        suggestion.innerHTML="";
      });

      laData.data.forEach(data => {

        let oneSuggestion=document.createElement('div');
        oneSuggestion.classList.add("one-suggestion");

        let suggestionImg=document.createElement('img');

        suggestionImg.setAttribute('src', "/assets/icon_search_suggestion.svg");
        oneSuggestion.appendChild(suggestionImg);

        let suggestionName=document.createElement('p');
        suggestionName.textContent=data.name;

        oneSuggestion.appendChild(suggestionName); 
        suggestion.appendChild(oneSuggestion);

        oneSuggestion.addEventListener('click', (e) => { 
          searchInput.value=suggestionName.textContent;
          suggestion.innerHTML="";
          search(e);
        });     

      })

      searchContainer.appendChild(suggestion);

    } catch (error) {
      console.log(error)
    }
    
  });


document.addEventListener('click', (e) => {
  if(!searchContainer.contains(e.target))
    suggestion.innerHTML="";
});