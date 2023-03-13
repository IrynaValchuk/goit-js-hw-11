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

const lightbox = new SimpleLightbox('.gallery .gallery__link', {
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

const doGalleryList = async (searchQuery, currentPage) => {
  try {
    const response = await fetchImages(searchQuery, currentPage);
    console.log('doImages  response:', response);
    currentHits += response.hits.length;
    console.log('doImages  currentHits:', currentHits);
    createImages(response.hits);

    if (response.hits.length === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (response.hits.length >= currentHits) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      loadMoreBtn.classList.remove('visually-hidden');
    }
    if (currentHits >= response.totalHits) {
      loadMoreBtn.classList.add('visually-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch {
    error => {
      console.log(error);
    };
  }
};
const onSearchForm = e => {
  e.preventDefault();
  currentPage = 1;
  galleryList.innerHTML = '';
  loadMoreBtn.classList.remove('visually-hidden');

  searchQuery = searchForm.elements.searchQuery.value.trim();

  if (!searchQuery) {
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    doGalleryList(searchQuery, currentPage);
  }
};

const onLoadMoreBtnClick = () => {
  currentPage += 1;
  searchQuery = searchForm.elements.searchQuery.value.trim();
  doGalleryList(searchQuery, currentPage);
};

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
