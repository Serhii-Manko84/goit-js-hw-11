import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './JS/fetchAPI.js';

const refs = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('[type="text"]'),
  btn: document.querySelector('[type="submit"]'),
  galleryItems: document.querySelector('.gallery'),
  btnLoad: document.querySelector('.load-more'),
  textCollections: document.querySelector('.text-Collections'),
};
// console.log(refs.btnLoad)

function renderImages(array) {
  const markup = array
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
        return `<div class='photo-card'>
  <a href='${largeImageURL}'>
    <img src='${webformatURL}' alt='${tags}' loading='lazy' />
  </a>
  <div class='info'>
    <p class='info-item'>
      <b>Likes</b>
      ${likes}
    </p>
    <p class='info-item'>
      <b>Views</b>
      ${views}
    </p>
    <p class='info-item'>
      <b>Comments</b>
      ${comments}
    </p>
    <p class='info-item'>
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`;
      }
    ).join('');

  refs.galleryItems.insertAdjacentHTML('beforeend', markup);
}

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

refs.form.addEventListener('submit', submitSearchForm);

async function submitSearchForm(event) {
  event.preventDefault();
  searchQuery = event.currentTarget.searchQuery.value;
  currentPage = 1;

  if (searchQuery === '') {
    return;
  }

  const response = await fetchImages(searchQuery, currentPage);
  currentHits = response.hits.length;

  if (response.totalHits > 40) {
    refs.btnLoad.classList.remove('is-hidden');
  } else {
    refs.btnLoad.classList.add('is-hidden');
  }

  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      refs.galleryItems.innerHTML = '';
      renderImages(response.hits);
      lightbox.refresh();
      refs.textCollections.classList.add('is-hidden');

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * -100,
        behavior: 'smooth',
      });
    }
    if (response.totalHits === 0) {
      refs.galleryItems.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.btnLoad.classList.add('is-hidden');
      refs.textCollections.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

refs.btnLoad.addEventListener('click', clickBtnLoad);

async function clickBtnLoad() {
  currentPage += 1;
  const response = await fetchImages(searchQuery, currentPage);
  renderImages(response.hits);
  lightbox.refresh();
  currentHits += response.hits.length;

  if (currentHits === response.totalHits) {
    refs.btnLoad.classList.add('is-hidden');
    refs.textCollections.classList.remove('is-hidden');
  }
}
