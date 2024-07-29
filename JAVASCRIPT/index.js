import { getModalMovie } from "./modal.js";
const homeWrapper = document.querySelector(".home-wrapper");
let inputValue = document.getElementById("title-input");
const categorySpan = document.getElementById("category-span");
const languageToggle = document.getElementById("chk1");
const categoryList = document.getElementById("category-list");
const modal = document.querySelector("dialog");
const footerSpan = document.querySelector("footer span");
const logo = document.querySelector("header .logo");
export let isLanguageKorean = true;
let category = "popular";
let scrollPage = 1;
let moviedata;
let prevCategory = "";
let ifSearching = false;
let debounceTimeout;
let prevSearchTitle = "";

if (prevCategory === "") {
  categorySpan.innerHTML = "카테고리";
}

export const options = {
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

  // 영화 포스터 클릭하면 모달창 띄우는 이벤트를 movie-box에 forEach로 붙임
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
window.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayMovies(
    `https://api.themoviedb.org/3/movie/popular?language=${isLanguageKorean ? "ko-KR" : "en-UN"}&page=1`
  );
});

// 모달창 바깥쪽 클릭하면 모달창 닫기
modal.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) modal.close();
  document.body.style.overflow = "auto";
});

// STM 로고 누르면 페이지 새로고침
logo.addEventListener("click", () => {
  window.location.href = "index.html";
});

// 검색 구현
inputValue.addEventListener("input", (e) => {
  prevSearchTitle = e.target.value;
  clearTimeout(debounceTimeout);
  scrollPage = 1;

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
  scrollPage = 1;
  isLanguageKorean = !isLanguageKorean;
  homeWrapper.innerHTML = "";
  footerSpan.style.visibility = "visible";
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
});

// 페이지 무한스크롤
const handleScroll = () => {
  const scrollTop = window.scrollY; // 현재 스크롤 위치
  const viewportHeight = window.innerHeight; // 뷰포트 높이
  const docHeight = document.documentElement.scrollHeight; // 전체 페이지 높이

  if (scrollTop + viewportHeight >= docHeight && scrollTop > 0 && moviedata.length === 20) {
    footerSpan.style.visibility = "visible";
    scrollPage++;

    ifSearching === false
      ? fetchAndDisplayMovies(`
          https://api.themoviedb.org/3/movie/${category}?language=${
          isLanguageKorean ? "ko-KR" : "en-UN"
        }&page=${scrollPage}`)
      : fetchAndDisplayMovies(
          `https://api.themoviedb.org/3/search/movie?query=${prevSearchTitle}&include_adult=true&language=${
            isLanguageKorean ? "ko-KR" : "en-UN"
          }&page=${scrollPage}`
        );
  }
};

document.addEventListener("scroll", handleScroll);
