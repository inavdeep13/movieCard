const API_KEY = "b88509c1"; 
const notFoundHtml = `<p style="color: white; font-size: 20px;">Movie not found</p>`;

const container = document.querySelector(".movie-cards");
const searchInput = document.getElementById("searchInput");


searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchMovie();
  }
});

async function fetchMovies(title) {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(title)}`);
  const data = await res.json();
  return data;
}

async function fetchMovieData(id) {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
  const data = await res.json();
  return data;
}

function createCard(movie, isSearched = false) {
  console.log(movie)
  return `
    <div class="card ${isSearched ? 'searched' : ''}">
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x400?text=No+Image'}" alt="${movie.Title}" />
      <div class="content">
        <h1 class="name">${movie.Title}</h1>
        <h3 class="infos">
          <i class="fa-solid fa-star"></i> ${movie.imdbRating}/10 | ${movie.Released} | ${movie.Runtime}
        </h3>
        <p class="short-desc">${movie.Plot}</p>
        <div class="icons">
          <a href="#"><i class="fa-solid fa-heart"></i></a>
          <a href="#"><i class="fa-solid fa-bookmark"></i></a>
          <a href="#"><i class="fa-solid fa-share"></i></a>
          <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title)}+trailer" target="_blank">
            <i class="fas fa-play"></i>
          </a>
        </div>
      </div>
    </div>
  `;
}

async function searchMovie() {
  try{
    const input = document.getElementById("searchInput").value.trim();
    if (!input) return;
    const data = await fetchMovies(input);

    if(data.Response == 'True'){
      const movies = data.Search; 
    
      container.innerHTML = "";

      if (movies.length === 0) {
        container.innerHTML = notFoundHtml
      }
    
      for (let movie of movies){
        const movieData = await fetchMovieData(movie.imdbID);

        const fullMovieData = {...movie, ...movieData}

        container.innerHTML += createCard(fullMovieData, true);
      }
    }else{
      container.innerHTML = notFoundHtml
    }
  } catch (err){
    alert(err.toString())
  }
}
