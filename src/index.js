import axios from 'axios';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const refs = {
    form: document.querySelector('#search-form'),
    input: document.querySelector('input')
}
console.log(refs.form)