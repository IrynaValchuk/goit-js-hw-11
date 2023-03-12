import { fetchImages } from './fetchImages';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import '../css/styles.css';

const searchForm = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let searchQuery = '';
loadMoreBtn.classList.add('visually-hidden');

// const clearForm = el => {
//   el.innerHTML = '';
// };

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: '250',
});

const createImages = images => {
  const markup = images.hits
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
  galleryList.innerHTML = markup;
  lightbox.refresh();
};

const onSearchForm = async e => {
  e.preventDefault();

  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  // currentPage = 1;

  if (searchQuery === '') {
    return;
  }

  const response = await fetchImages(searchQuery, currentPage);

  try {
    if (response.totalHits === 0) {
      galleryList.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      galleryList.innerHTML = '';
      createImages(response);
      loadMoreBtn.classList.remove('visually-hidden');

      // const { height: cardHeight } = document
      //   .querySelector('.gallery')
      //   .firstElementChild.getBoundingClientRect();

      // window.scrollBy({
      //   top: cardHeight * -100,
      //   behavior: 'smooth',
      // });
    }
  } catch {
    error => {
      console.log(error);
    };
  }
};

const onLoadMoreBtnClick = () => {
  currentPage += 1;
  const searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  const response = fetchImages(searchQuery, currentPage);
  createImages(response);

  // console.log('click');
};

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
