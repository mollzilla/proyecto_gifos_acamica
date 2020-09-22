/* API */

// una api key, deberia conseguir la mia
const apiKey="VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn";

/* trending search terms */

async function appendTrendings() {

  async function getTrendings() {
    try {
      const trendingEndPoint= await fetch(`https://api.giphy.com/v1/trending/searches?&api_key=${apiKey}`);
      const trendingFetch = await trendingEndPoint.json();
      trendingData = trendingFetch.data.splice(0,5);
      return trendingData;
    } catch (err) {
      console.log(err);
    }
  }

  let content = await getTrendings()

  content=content.join(", ")
  document.querySelector(".trending-stuff").textContent=content;
}
appendTrendings();

let searchContainer=document.querySelector(".search-border");

let searchInput=document.querySelector("#search-input");

let suggestion=document.createElement('div');


  let closeIcon=document.querySelector("#close-search");
  let searchIcon=document.querySelector("#search-icon");

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

      searchIcon.style.display="none";
      closeIcon.style.display="initial";

      closeIcon.addEventListener('click', function() {
        searchInput.value="";
        searchIcon.style.display="initial";
        this.style.display="none";
        suggestion.innerHTML="";
      });

      laData.data.forEach(data => {

        let oneSuggestion=document.createElement('div');
        oneSuggestion.style.display="flex";
        let suggestionImg=document.createElement('img');

        suggestionImg.setAttribute('src', "/assets/icon-search-suggestion.svg");
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