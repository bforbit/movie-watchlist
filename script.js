const searchInput = document.getElementById("search-input")
const searchBtn = document.getElementById("search-btn")
const searchResults = document.getElementById("search-results")
const searchPre = document.getElementById("search-pre")
const searchError = document.getElementById("search-error")
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []

searchBtn.addEventListener("click", () => {
   fetch(`https://www.omdbapi.com/?apikey="YOUR_API_KEY_HERE"&s=${searchInput.value}`)
   .then(res => res.json())
   .then(data => {

      // search cycles change
      searchResults.innerHTML = ""
      searchPre.style.display = "none"

      if (searchInput.value === "" || data.Response === "False") {
         searchError.style.display = "block"
      } else {
         searchError.style.display = "none"

      // fetch film data from API
      data.Search.forEach(movie => {
         fetch(`https://www.omdbapi.com/?apikey="YOUR_API_KEY_HERE"&i=${movie.imdbID}`)
            .then(res => res.json())
            .then(details => {

               // establish posters (placeholder or image from API)
               let posterPlaceholder
               if (details.Poster === "N/A") {
                  posterPlaceholder = "placeholder.png"
               } else {
                  posterPlaceholder = details.Poster
               }

               // render film results
               searchResults.innerHTML += `
                  <div class="movie-result">
                     <div class="movie-poster">
                        <img src="${posterPlaceholder}">
                     </div>

                     <div class="movie-info">
                        <div class="movie-row1">
                           <div class="movie-title">${details.Title}</div>
                           <div class="movie-rating"><img src="icon-star.png"> ${details.imdbRating}</div>
                        </div>
                        <div class="movie-row2">
                           <div class="movie-runtime">${details.Runtime}</div>
                           <div class="movie-genres">${details.Genre}</div>
                           <button class="add-watchlist" data-movie="${JSON.stringify(details).replace(/"/g, '&quot;')}">
                              <img src="icon-add.png">
                              <div class="add-watchlist-text">Watchlist</div>
                           </button>
                        </div>
                        <div class="movie-row3">
                           <div class="movie-plot">${details.Plot}</div>
                        </div>
                     </div>
                  </div>
               `
            })
         })
      }})
   })

// Listen for clicks on add-watchlist buttons
document.addEventListener("click", e => {
   const clickedAddBtn = e.target.closest(".add-watchlist")
   if (!clickedAddBtn) return

   const movieDataStr = clickedAddBtn.getAttribute("data-movie")
   const movieObj = JSON.parse(movieDataStr)

  // Check if movie is already in watchlist
   const alreadyInWatchlist = watchlist.some(movie => movie.imdbID === movieObj.imdbID)

   if (alreadyInWatchlist) {
    // Remove from watchlist; button changes from remove to add
      watchlist = watchlist.filter(movie => movie.imdbID !== movieObj.imdbID)
      clickedAddBtn.querySelector("img").src = "icon-add.png"
      clickedAddBtn.querySelector(".add-watchlist-text").textContent = "Watchlist"
   } else {
    // Add to watchlist; button changes from add to remove
      watchlist.push(movieObj)
      clickedAddBtn.querySelector("img").src = "icon-remove.png"
      clickedAddBtn.querySelector(".add-watchlist-text").textContent = "Remove"
   }

   localStorage.setItem("watchlist", JSON.stringify(watchlist))
});
