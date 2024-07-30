import { state } from "./state.js";
import { inputValue, homeWrapper, footerSpan, fetchAndDisplayMovies, categorySpan } from "./index.js";

// 카테고리 영화 리스트
export const changeCategory = (e) => {
  inputValue.value = "";
  state.ifSearching = false;
  state.prevSearchTitle = inputValue.value;
  state.scrollPage = 1;
  state.category = e.target.id;
  homeWrapper.innerHTML = "";
  footerSpan.style.visibility = "visible";
  fetchAndDisplayMovies(
    `https://api.themoviedb.org/3/movie/${e.target.id}?language=${state.isLanguageKorean ? "ko-KR" : "en-UN"}&page=1`
  );
  categorySpan.innerText = document.getElementById(state.category).innerText;
};
