document.addEventListener("DOMContentLoaded", () => {
   const watchlist = JSON.parse(localStorage.getItem("watchlist")) || []
   const watchlistPre = document.getElementById("watchlist-pre")
   const watchlistDisplay = document.getElementById("watchlist-display")

   if (watchlist.length === 0) {
      watchlistPre.style.display = "block"
   } else {
      watchlistPre.style.display = "none"

      watchlist.forEach(movieObj => {

         // establish posters (placeholder or image from API)
         let posterPlaceholder
         if (movieObj.Poster === "N/A") {
            posterPlaceholder = "placeholder.png"
         } else {
            posterPlaceholder = movieObj.Poster
         }

         // render movie results
         watchlistDisplay.innerHTML += `
            <div class="movie-result">
               <div class="movie-poster">
                  <img src="${posterPlaceholder}">
               </div>
               <div class="movie-info">
                  <div class="movie-row1">
                     <div class="movie-title">${movieObj.Title}</div>
                     <div class="movie-rating"><img src="icon-star.png"> ${movieObj.imdbRating}</div>
                  </div>
                  <div class="movie-row2">
                     <div class="movie-runtime">${movieObj.Runtime}</div>
                     <div class="movie-genres">${movieObj.Genre}</div>
                     <button class="remove-watchlist" data-movie="${JSON.stringify(movieObj).replace(/"/g, '&quot;')}">
                        <img src="icon-remove.png">
                        <div class="remove-watchlist-text">Remove</div>
                     </button>
                  </div>
                  <div class="movie-row3">
                     <div class="movie-plot">${movieObj.Plot}</div>
                  </div>
               </div>
            </div>
         `
      })
   }

   // remove film from watchlist and update changes
   document.addEventListener("click", (e) => {
      const clickedRemoveBtn = e.target.closest(".remove-watchlist")
      if (clickedRemoveBtn) {
         const movieDataStr = clickedRemoveBtn.getAttribute("data-movie")
         const movieObj = JSON.parse(movieDataStr)

         let updatedWatchlist = watchlist.filter(movie => movie.imdbID !== movieObj.imdbID)
         localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist))
         location.reload()
      }
   })
})
