import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const key = '34345313-e136fe2b46f52c58a614c87be';

export const fetchImages = async (searchQuery, currentPage) => {
  const params = {
    key: `${key}`,
    q: `${searchQuery}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: `${currentPage}`,
    per_page: 40,
  };

  return await axios
    .get(`${BASE_URL}`, { params })
    .then(response => response.data);
};
