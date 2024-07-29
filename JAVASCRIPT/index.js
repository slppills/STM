const homeWrapper = document.querySelector(".home-wrapper");
let inputValue = document.getElementById("title-input");
const categoryItems = document.querySelectorAll(".header-navbar li");
const categorySpan = document.getElementById("category-span");
const languageToggle = document.getElementById("chk1");
const categoryList = document.getElementById("category-list");
const modal = document.querySelector("dialog");
const footerSpan = document.querySelector("footer span");
let isLanguageKorean = true;
let category = "popular";
let moviedata;
let scrollPage = 1;
let prevCategory = "";
let ifSearching = false;

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
      footerSpan.style.visibility = "hidden";
    })
    .catch((err) => console.error(err));
};

const displayMovies = (movies) => {
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

  // 영화 포스터 클릭하면 모달창 띄우는 이벤트
  document.querySelectorAll(".movie-box").forEach((box) => {
    box.addEventListener("click", (e) => {
      alert("영화 아이디 : " + e.target.id);
      getModalMovie(e.target.id);
      modal.showModal();
      document.body.style.overflow = "hidden";
    });
  });
};

// 처음 화면에 불러오는 데이터
fetchAndDisplayMovies(
  `https://api.themoviedb.org/3/movie/popular?language=${isLanguageKorean ? "ko-KR" : "en-UN"}&page=1`
);

// 포스터 클릭하면 모달창에 영화 정보 불러옴
const getModalMovie = (movieId) => {
  const modalWrapper = document.querySelector(".modal");
  const modalLoading = `
    <div class="modal-loading"><span>Loading...</span></div>
  `;
  modalWrapper.innerHTML = modalLoading;
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=${isLanguageKorean ? "ko-KR" : "en-UN"}`, options)
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

// 모달창 바깥쪽 클릭하면 모달창 닫기
modal.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) modal.close();
  document.body.style.overflow = "auto";
});

// 검색 구현
let debounceTimeout;
let prevSearchTitle = "";

inputValue.addEventListener("input", (e) => {
  prevSearchTitle = e.target.value;
  clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(() => {
    homeWrapper.innerHTML = "";
    footerSpan.style.visibility = "visible";
    if (e.target.value.length > 0) {
      ifSearching = true;
      fetchAndDisplayMovies(
        `https://api.themoviedb.org/3/search/movie?query=${e.target.value}&include_adult=true&language=${
          isLanguageKorean ? "ko-KR" : "en-UN"
        }&page=1`
      );
    } else {
      ifSearching = false;
      fetchAndDisplayMovies(
        `https://api.themoviedb.org/3/movie/${category}?language=${isLanguageKorean ? "ko-KR" : "en-UN"}`
      );
    }
  }, 300);
});

// 카테고리 영화 리스트
categoryList.addEventListener("click", (e) => {
  scrollPage = 1;
  category = e.target.id;
  homeWrapper.innerHTML = "";
  footerSpan.style.visibility = "visible";
  fetchAndDisplayMovies(
    `https://api.themoviedb.org/3/movie/${e.target.id}?language=${isLanguageKorean ? "ko-KR" : "en-UN"}&page=1`
  );
  categorySpan.innerText = document.getElementById(category).innerText;
});

// 언어 변경(한국어 or 영어)
languageToggle.addEventListener("click", () => {
  isLanguageKorean = !isLanguageKorean;
  console.log(isLanguageKorean);
  homeWrapper.innerHTML = "";
  footerSpan.style.visibility = "visible";
  ifSearching === false
    ? fetchAndDisplayMovies(
        `https://api.themoviedb.org/3/movie/${category}?language=${isLanguageKorean ? "ko-KR" : "en-UN"}`
      )
    : fetchAndDisplayMovies(
        `https://api.themoviedb.org/3/search/movie?query=${prevSearchTitle}&include_adult=true&language=${
          isLanguageKorean ? "ko-KR" : "en-UN"
        }&page=1`
      );
});

// 페이지 무한스크롤
document.addEventListener("scroll", () => {
  const scrollTop = window.scrollY; // 현재 스크롤 위치
  const viewportHeight = window.innerHeight; // 뷰포트 높이
  const docHeight = document.documentElement.scrollHeight; // 전체 페이지 높이

  if (scrollTop + viewportHeight >= docHeight) {
    if (moviedata.length === 20) footerSpan.style.visibility = "visible";
    scrollPage++;
    ifSearching === false
      ? fetchAndDisplayMovies(
          `https://api.themoviedb.org/3/movie/${category}?language=${
            isLanguageKorean ? "ko-KR" : "en-UN"
          }&page=${scrollPage}`
        )
      : fetchAndDisplayMovies(
          `https://api.themoviedb.org/3/search/movie?query=${prevSearchTitle}&include_adult=true&language=${
            isLanguageKorean ? "ko-KR" : "en-UN"
          }&page=${scrollPage}`
        );
  }
});
