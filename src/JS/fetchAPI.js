import axios from 'axios';

export async function fetchImages(value, page) {
    const url = 'https://pixabay.com/api/'
    const key = '31784289-8c5c8bddae77d61fff616be96';
    const filter = `?key=${key}&q=${value}$&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
    return await axios.get(`${url}${filter}`).then(response => response.data);
}


