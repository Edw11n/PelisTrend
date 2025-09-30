// CONFIGURACION DE LA API
const API_KEY = "cc9bdef275e574f8d8d94a178dd54278";
const BASE_URL = "https://api.themoviedb.org/3"
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// ELEMENTOS DEL DOM
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const genreFilter = document.getElementById("genreFilter");
const yearFilter = document.getElementById("yearFilter");
const sortFilter = document.getElementById("sortFilter");
const themeToggle = document.getElementById("themeToggle");
const movieList = document.getElementById("movieList");
const movieDetail = document.getElementById("movieDetail");
const detailContent = document.getElementById("detailContent");
const headerTitle = document.querySelector("header h1");

// FUNCIONES
// Recargar pagina
headerTitle.addEventListener("click", () => {
    location.reload();
});
// Cargar peliculas por defecto
async function getPopularMovies() {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`);
    const data = await res.json();
    renderMovies(data.results);
}


// Buscar peliculas
async function searchMovies(query) {
    if (!query.trim()) {
        await getPopularMovies();
        return;
    }
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${query}`);
    const data = await res.json();
    renderMovies(data.results);
}

// Cargar generos para el filtro
async function loadGenres() {
    const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`);
    const data = await res.json();

    data.genres.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre.id;
        option.textContent = genre.name;
        genreFilter.appendChild(option);
    });
}
// Filtrar peliculas
async function filterMovies() {
    const genre = genreFilter.value;
    const year = yearFilter.value;
    const sort = sortFilter.value;

    const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&sort_by=${sort}&with_genres=${genre}&primary_release_year=${year}`);
    const data = await res.json();
    renderMovies(data.results);
}

// Render de peliculas
function renderMovies(movies) {
    movieList.innerHTML = "";
    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `
            <img src="${IMAGE_BASE_URL + movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
        `;
        // Evento para mostrar detalle
        card.addEventListener("click", () => {
            console.log('Click en: ', movie.id, movie.title);
            showMovieDetail(movie.id);
        });
        movieList.appendChild(card);
    });
}
// Mostrar detalle de pelicula
async function showMovieDetail(id) {
    try {
    // obtener detalles de la pelicula
        const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`);
        const movie = await res.json();

        // trailer de youtube
        const resVid = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=es-ES`);
        const vids = await resVid.json();
        let trailer = null;

        if (vids.results && vids.results.length > 0) {
            trailer = vids.results.find(video => video.type === "Trailer" && video.site === "YouTube");
        }
        detailContent.innerHTML = `
            <button id="backBtn">⬅ Volver</button>
            <h2>${movie.title}</h2>
            <p><strong>Géneros:</strong> ${movie.genres.map(g => g.name).join(", ")}</p>
            <p><strong>Duración:</strong> ${movie.runtime} min</p>
            <p><strong>Calificación:</strong> ⭐ ${movie.vote_average.toFixed(1)}/ 10</p>
            <p>${movie.overview}</p>
            ${trailer 
                ? `<iframe widht="560" height="315" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>` 
                : "<p>No hay tráiler disponible.</p>"}
        `;
        movieList.classList.add("hidden");
        movieDetail.classList.remove("hidden");

        document.getElementById("backBtn").addEventListener("click", () => {
            movieDetail.classList.add("hidden");
            movieList.classList.remove("hidden");
});
    } catch (error) {
        console.error("Error al cargar los detalles de la película:", error);
        detailContent.innerHTML = "<p>Error al cargar los detalles de la película. Por favor, inténtalo de nuevo más tarde.</p>";
    }
}

// MODO OSCURO / CLARO
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-theme");
    themeToggle.textContent = "🌙";
} else {
    themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");

    if (document.body.classList.contains("light-theme")) {
        themeToggle.textContent = "🌙";
        localStorage.setItem("theme", "light");
    } else {
        themeToggle.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    }
});


// EVENTOS
searchBtn.addEventListener("click", () => searchMovies(searchInput.value));
sortFilter.addEventListener("change", filterMovies);
genreFilter.addEventListener("change", filterMovies);
yearFilter.addEventListener("change", filterMovies);

// INICIO
getPopularMovies();
loadGenres();