import { state } from "./state.js";
import { homeWrapper, footerSpan, fetchAndDisplayMovies } from "./index.js";

// 언어 변경(한국어 or 영어)
export const changeLanguage = () => {
  state.scrollPage = 1;
  state.isLanguageKorean = !state.isLanguageKorean;
  homeWrapper.innerHTML = "";
  footerSpan.style.visibility = "visible";
  state.ifSearching === false
    ? fetchAndDisplayMovies(
        `https://api.themoviedb.org/3/movie/${state.category}?language=${
          state.isLanguageKorean ? "ko-KR" : "en-UN"
        }&page=${state.scrollPage}`
      )
    : fetchAndDisplayMovies(
        `https://api.themoviedb.org/3/search/movie?query=${state.prevSearchTitle}&include_adult=true&language=${
          state.isLanguageKorean ? "ko-KR" : "en-UN"
        }&page=${state.scrollPage}`
      );
};
