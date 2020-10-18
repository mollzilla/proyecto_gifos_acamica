/* API KEY */
const apiKey = "VZ4N6ebz6BSdgrhUNiKAAU0dNYws5GSn";

let mainTitle = document.querySelector("h1");
let searchSection = document.querySelector(".search");
let trending = document.querySelector(".trending");
let viewMore = document.querySelector("#view-more");
let viewMoreFavorites = document.querySelector("#view-more-favorites");
let viewMoreMyGifos = document.querySelector("#view-more-my-gifos");
let searchArgument = document.querySelector("#search-argument");
let trendingStuff = document.querySelector(".trending-stuff");



document.querySelector(".logo").addEventListener("click", () => {
  [mainTitle, searchSection].map(x => x.style.display = "block");
  [resultsGrid, viewMore, viewMoreFavorites, viewMoreMyGifos, searchArgument].map(x => x.style.display = "none");

  trending.style.display = "flex"
  searchArgument.textContent = "";
});

window.addEventListener('DOMContentLoaded', () => { // go back to index.html with button functinality
  if (window.location.hash[0] == '#')
    search(window.location.hash.slice(1));
});

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
  let carousel = document.querySelector(".carousel__images");

  function appendCarousel(data, container) {

    data.forEach(result => {
      let resultGif = document.createElement("div");
      resultGif.classList.add("result-placeholder");
      resultGif.setAttribute('id', `result-item-${offset}`);
      resultGif.style.backgroundImage = `url("${result.images.fixed_width.url}")`;
      resultGif.appendChild(createOverlay(result));
      container.appendChild(resultGif);
    });
  }

  appendCarousel((content[1].data.splice(0, 10)), carousel)

  const carouselImages = document.querySelector(".carousel__images");
  const carouselButtons = document.querySelectorAll(".carousel__button");

  let imageIndex = 1;
  let translateX = 0;

  carouselButtons.forEach(button => {

    button.addEventListener('click', (e) => {
      if (e.target.id == "previous") {
        if (imageIndex != 1) {
          imageIndex--;
          translateX += 350;
        }
      } else {
        if (imageIndex < 9) {
          imageIndex++;
          translateX -= 350;
        }
      }
      carouselImages.style.transform = `translateX(${translateX}px)`;
    });
  });

  content[0].data.forEach((word, i) => {

    if (i > 4)
      return;

    let span = document.createElement("span");

    span.textContent = word == content[0].data[4] ? word : `${word}, `;

    trendingStuff.appendChild(span);
    span.style.cursor = "pointer";

    span.addEventListener("click", (e) => {
      searchInput.value = span.textContent.replace(", ", "");
      search(e.path[0].id);
    });
  });
}

appendTrendings();

let searchContainer = document.querySelector(".search-border");
let searchInput = document.querySelector("#search-input");

let closeIcon = document.querySelector("#icon_close");
let searchIcon = document.querySelector("#icon_search");
let searchIconSm = document.querySelector("#icon_search_sm");

let suggestion = document.createElement('div');

let laData;

searchInput.addEventListener('keyup', async function (e) {

  try {

    if (e.keyCode === 13) {
      e.stopPropagation();
      search(e.path[0].id);
      return;
    }

    suggestion.innerHTML = "";

    if (this.value.trim() == "") {
      searchIcon.style.display = "inline";
      closeIcon.style.display = "none";
      return;
    }

    const elFetch = await fetch(`https://api.giphy.com/v1/gifs/search/tags?q=${this.value}?&api_key=${apiKey}`);
    laData = await elFetch.json();

    searchIcon.style.transform = "translate(-2250%, 10%)";
    searchIconSm.id = "icon_search_active";
    closeIcon.style.display = "inline";

    closeIcon.addEventListener('click', function () {
      searchInput.value = "";
      searchIcon.style.display = "initial";
      this.style.display = "none";
      suggestion.innerHTML = "";
    });

    laData.data.forEach(data => {

      let oneSuggestion = document.createElement('div');
      oneSuggestion.classList.add("one-suggestion");

      let suggestionImg = document.createElement('img');

      suggestionImg.setAttribute('src', "/assets/icon_search_suggestion.svg");
      oneSuggestion.appendChild(suggestionImg);

      let suggestionName = document.createElement('p');
      suggestionName.textContent = data.name;

      oneSuggestion.appendChild(suggestionName);
      suggestion.appendChild(oneSuggestion);

      oneSuggestion.addEventListener('click', (e) => {
        searchInput.value = suggestionName.textContent;
        suggestion.innerHTML = "";
        search(e.path[0].id);
      });

    })

    searchContainer.appendChild(suggestion);

  } catch (error) {
    console.log(error)
  }

});


document.addEventListener('click', (e) => {
  if (!searchContainer.contains(e.target))
    suggestion.innerHTML = "";
});
