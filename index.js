const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const API_KEY = "cc9bdef275e574f8d8d94a178dd54278";
const BASE_URL = "https://api.themoviedb.org/3"

const carousel = document.getElementById("carousel");


async function loadCatalogo() {
    try {
    const res = await fetch(
        `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=es-ES&page=1`
    );
    const data = await res.json();

    carousel.innerHTML = data.results
        .slice(0, 8)
        .map(
        (movie) => `
            <div class="movie">
            <img src="${IMAGE_BASE_URL + movie.poster_path}" alt="${movie.title}">
            <p>${movie.title}</p>
            </div>
        `
        )
        .join("");
    } catch (error) {
    console.error("Error cargando catálogo:", error);
    }
}

loadCatalogo();