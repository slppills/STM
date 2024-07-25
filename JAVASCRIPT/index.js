const homeWrapper = document.querySelector(".home-wrapper");
let inputValue = document.getElementById("title-input");
const categoryItems = document.querySelectorAll(".header-navbar li");
const categorySpan = document.getElementById("category-span");
let moviedata;
let prevCategory = "";

if (prevCategory === "") {
  categorySpan.innerHTML = "카테고리";
}

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNDQxY2NmMGE4YmNiYmVjYTE3ZWY4OTk4OGM5ZTQxZiIsIm5iZiI6MTcyMTgwNTUxNy44NDgzMywic3ViIjoiNjZhMDlmZWIzMmQ0ZTYxZTZmMGJlODQ5Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.McCnuBIhgFLuzaTHkJbG1nR5CgByY76zlj9HV4QAoBQ",
  },
};

const fetchAndDisplayMovies = (url) => {
  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      moviedata = [...response.results];
      displayMovies(moviedata);
    })
    .catch((err) => console.error(err));
};

const displayMovies = (movies) => {
  homeWrapper.innerHTML = "";
  movies.forEach((movie) => {
    const moviePoster = `https://image.tmdb.org/t/p/w200/${movie.poster_path}`;
    const movieList = `
      <div class="movie-box">
        <div class="movie-box-wrapper">
          <img src="${moviePoster}" alt="${movie.title}">
          <span>${movie.title}</span>
        </div>
      </div>`;
    homeWrapper.innerHTML += movieList;
  });
};

fetchAndDisplayMovies("https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1");

inputValue.addEventListener("input", (e) => {
  const searchTitle = moviedata.filter((movie) => movie.title.includes(e.target.value));
  displayMovies(searchTitle);
});

const categoryList = document.getElementById("category-list");
categoryList.addEventListener("click", (e) => {
  const category = e.target.id;
  fetchAndDisplayMovies(`https://api.themoviedb.org/3/movie/${e.target.id}?language=ko-KR&page=1`);
  categorySpan.innerText = document.getElementById(category).innerText;
});
