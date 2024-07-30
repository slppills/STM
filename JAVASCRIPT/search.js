import { state } from "./state.js";
import { homeWrapper, footerSpan, fetchAndDisplayMovies } from "./index.js";

// 검색 구현
export const searchMovie = (e) => {
  state.prevSearchTitle = e.target.value;
  clearTimeout(state.debounceTimeout);
  state.scrollPage = 1;

  state.debounceTimeout = setTimeout(() => {
    homeWrapper.innerHTML = "";
    footerSpan.style.visibility = "visible";
    if (e.target.value.length > 0) {
      state.ifSearching = true;
      fetchAndDisplayMovies(
        `https://api.themoviedb.org/3/search/movie?query=${e.target.value}&include_adult=true&language=${
          state.isLanguageKorean ? "ko-KR" : "en-UN"
        }&page=1`
      );
    } else {
      state.ifSearching = false;
      fetchAndDisplayMovies(
        `https://api.themoviedb.org/3/movie/${state.category}?language=${state.isLanguageKorean ? "ko-KR" : "en-UN"}`
      );
    }
  }, 300);
};
