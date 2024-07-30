import { options } from "./index.js";
import { state } from "./state.js";

// 포스터 클릭하면 모달창에 영화 정보 불러옴
export const getModalMovie = (movieId) => {
  const modalWrapper = document.querySelector(".modal");
  const modalLoading = `
        <div class="modal-loading"><span>Loading...</span></div>
      `;
  modalWrapper.innerHTML = modalLoading;
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=${state.isLanguageKorean ? "ko-KR" : "en-UN"}`, options)
    .then((response) => response.json())
    .then((response) => {
      const modalMoviedata = response;
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
