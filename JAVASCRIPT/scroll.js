import { footerSpan, fetchAndDisplayMovies, incrementScrollPage } from "./index.js";
import { state } from "./state.js";

// 페이지 무한스크롤
export const handleScroll = () => {
  const scrollTop = window.scrollY; // 현재 스크롤 위치
  const viewportHeight = window.innerHeight; // 뷰포트 높이
  const docHeight = document.documentElement.scrollHeight; // 전체 페이지 높이

  if (scrollTop + viewportHeight >= docHeight && scrollTop > 0 && state.moviedata.length === 20) {
    footerSpan.style.visibility = "visible";
    incrementScrollPage();

    state.ifSearching === false
      ? fetchAndDisplayMovies(`
            https://api.themoviedb.org/3/movie/${state.category}?language=${
          state.isLanguageKorean ? "ko-KR" : "en-UN"
        }&page=${state.scrollPage}`)
      : fetchAndDisplayMovies(
          `https://api.themoviedb.org/3/search/movie?query=${state.prevSearchTitle}&include_adult=true&language=${
            state.isLanguageKorean ? "ko-KR" : "en-UN"
          }&page=${state.scrollPage}`
        );
  }
};

document.addEventListener("scroll", handleScroll);
