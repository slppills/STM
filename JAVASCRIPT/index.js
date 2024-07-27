const homeWrapper = document.querySelector(".home-wrapper");
let inputValue = document.getElementById("title-input");
const categoryItems = document.querySelectorAll(".header-navbar li");
const categorySpan = document.getElementById("category-span");
const languageToggle = document.getElementById("chk1");
const categoryList = document.getElementById("category-list");
const modal = document.querySelector("dialog");
let isLanguageKorean = true;
let category = "popular";
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
      console.log(moviedata);
      displayMovies(moviedata);
    })
    .catch((err) => console.error(err));
};

const displayMovies = (movies) => {
  homeWrapper.innerHTML = "";
  movies.forEach((movie) => {
    const moviePoster = `https://image.tmdb.org/t/p/w200/${movie.poster_path}`;
    const movieList = `
      <div class="movie-box" id=${movie.id}>
        <div class="movie-box-wrapper" id=${movie.id}>
          <img src="${moviePoster}" alt="${movie.title}" id=${movie.id}>
          <span id=${movie.id}>${movie.title}</span>
        </div>
      </div>`;
    homeWrapper.innerHTML += movieList;
  });

  document.querySelectorAll(".movie-box").forEach((box) => {
    box.addEventListener("click", (e) => {
      getModalMovie(e.target.id);
      modal.showModal();
      document.body.style.overflow = "hidden";
    });
  });
};

fetchAndDisplayMovies(`https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1`);

const getModalMovie = (movieId) => {
  const modalWrapper = document.querySelector(".modal");
  const modalLoading = `
    <div class="modal-loading"><span>Loading...</span></div>
  `;
  modalWrapper.innerHTML = modalLoading;
  fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?language=${isLanguageKorean === true ? "ko-KR" : "en-UN"}`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      const modalMoviedata = response;
      console.log(modalMoviedata);
      const moviePoster = `https://image.tmdb.org/t/p/w500/${modalMoviedata.backdrop_path}`;

      const MovieInfo = `
        <div class="modal-image">
          <img src=${moviePoster} alt=${modalMoviedata.title}>
          <div class="modal-genres">${modalMoviedata.genres.map((genre) => `<span>#${genre.name}</span>`)}</div>
        </div>
        <div class="modal-info">
          <div class="modal-info-wrapper">
            <h1>${modalMoviedata.title}</h1>
            <div class="modal-releasedate">
              <span>${modalMoviedata.release_date}</span>
              <div><span class="vote_average">${modalMoviedata.vote_average.toFixed(1)}</span>/10</div>
            </div>
            <span class="modal-overview">${
              modalMoviedata.overview ? modalMoviedata.overview : "(언어를 바꿔주세요)"
            }</span>
          </div>
          
        </div>
      `;
      modalWrapper.innerHTML = MovieInfo;
    })
    .catch((err) => console.error(err));
};

modal.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) modal.close();
  document.body.style.overflow = "auto";
});

inputValue.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase().replace(/\s+/g, "");
  const searchTitle = moviedata.filter((movie) => movie.title.toLowerCase().replace(/\s+/g, "").includes(searchTerm));
  displayMovies(searchTitle);
});

categoryList.addEventListener("click", (e) => {
  category = e.target.id;
  fetchAndDisplayMovies(`https://api.themoviedb.org/3/movie/${e.target.id}?language=ko-KR&page=1`);
  categorySpan.innerText = document.getElementById(category).innerText;
});

languageToggle.addEventListener("click", () => {
  isLanguageKorean = !isLanguageKorean;
  isLanguageKorean === true
    ? fetchAndDisplayMovies(`https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=1`)
    : fetchAndDisplayMovies(`https://api.themoviedb.org/3/movie/${category}?language=en-UN&page=1`);
});

document.addEventListener("scroll", () => {
  const scrollTop = window.scrollY; // 현재 스크롤 위치
  const viewportHeight = window.innerHeight; // 뷰포트 높이
  const docHeight = document.documentElement.scrollHeight; // 전체 페이지 높이

  if (scrollTop + viewportHeight >= docHeight) {
    isLanguageKorean === true
      ? fetchAndDisplayMovies(`https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=1`)
      : fetchAndDisplayMovies(`https://api.themoviedb.org/3/movie/${category}?language=en-UN&page=1`);
  }
});
