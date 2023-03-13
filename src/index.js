import { fetchImages } from './js/fetchImages';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './css/styles.css';

const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let searchQuery = '';
let currentHits = 0;

loadMoreBtn.classList.add('visually-hidden');

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: '250',
});

const createImages = images => {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<li class="gallery__item">
          <a class="gallery__link" href="${largeImageURL}">
            <div class="photo-card">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" />
              <div class="info">
                <p class="info-item">
                  <b>Likes</b> ${likes}
                </p>
                <p class="info-item">
                  <b>Views</b> ${views}
                </p>
                <p class="info-item">
                  <b>Comments</b> ${comments}
                </p>
                <p class="info-item">
                  <b>Downloads</b> ${downloads}
                </p>
              </div>
            </div>
          </a>
        </li>`;
      }
    )
    .join('');
  galleryList.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
};

const onSearchForm = async e => {
  e.preventDefault();

  searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  currentPage = 1;
  galleryList.innerHTML = '';

  if (!searchQuery) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  const response = await fetchImages(searchQuery, currentPage);
  currentHits = response.hits.length;

  try {
    if (response.totalHits === 0) {
      loadMoreBtn.classList.add('visually-hidden');
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      createImages(response.hits);
      loadMoreBtn.classList.remove('visually-hidden');
    }
  } catch {
    error => {
      console.log(error);
    };
  }
};

const onLoadMoreBtnClick = async () => {
  currentPage += 1;
  const response = await fetchImages(searchQuery, currentPage);
  createImages(response.hits);
  currentHits += response.hits.length;

  if (currentHits >= response.totalHits) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadMoreBtn.classList.add('visually-hidden');
  }
};

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
