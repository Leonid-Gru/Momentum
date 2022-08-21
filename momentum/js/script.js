import playList from './playList.js'

const time = document.querySelector('.time');
const date = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const myName = document.querySelector('.name');
const body = document.querySelector('body');
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const myCity = document.querySelector('.city');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');
const play = document.querySelector('.play');
const prevSong = document.querySelector('.play-prev');
const nextSong = document.querySelector('.play-next');
const playListContainer = document.querySelector('.play-list');
const settingsImg = document.querySelector('.settings__img');
const settings = document.querySelector('.settings__container');
const language = document.querySelector('.language');
const images = document.querySelector('.images');

/* Settings */
settingsImg.addEventListener('click', () => {
    settings.classList.toggle('settings__active');
});

language.addEventListener('change', () => {
    state.language = language.value;
    showTime();
    getTimeOfDay();
    getWeather();
    getQuotes();
    getLocalStorage();
});

images.addEventListener('change', () => {
    state.photoSource = images.value;
});

const state = {
    language: 'en',
    photoSource: 'GitHub',
    blocks: ['time', 'date', 'greeting', 'quote', 'weather', 'audio', 'todolist']
}

/* Time and Date*/
function showTime() {
    const today = new Date();
    const currentTime = today.toTimeString();
    time.textContent = currentTime.split(' ')[0];

    function showDate() {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        const currentDate = today.toLocaleDateString(state.language, options);
        date.textContent = currentDate;
    }
    showDate();
    setTimeout(showTime, 1000);
}
showTime();

/* Greeting */
function getTimeOfDay() {
    let timeOfDay = '';
    const today = new Date();
    let greetingText = {};
    const hours = today.getHours();
    if (6 <= hours && hours <= 11) {
        greetingText = { 'en': 'Good morning', 'ru': 'Доброе утро' };
        timeOfDay = 'morning';
    } else if (12 <= hours && hours <= 17) {
        greetingText = { 'en': 'Good afternoon', 'ru': 'Добрый день' };
        timeOfDay = 'afternoon';
    } else if (18 <= hours && hours <= 23) {
        greetingText = { 'en': 'Good evening', 'ru': 'Добрый вечер' };
        timeOfDay = 'evening';
    } else {
        greetingText = { 'en': 'Good night', 'ru': 'Доброй ночи' };
        timeOfDay = 'night';
    }
    greeting.textContent = greetingText[state.language];
    setTimeout(getTimeOfDay, 1000);
    return timeOfDay;
}
getTimeOfDay()

/* Add name */
function setLocalStorage() {
    localStorage.setItem('name', myName.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
    if (!myName.value) {
        state.language == 'en' ?
            myName.placeholder = "[Enter name]" :
            myName.placeholder = "[Введите имя]";
    }
    if (localStorage.getItem('name')) {
        myName.value = localStorage.getItem('name');
    }
}
window.addEventListener('load', getLocalStorage);

/* Slider */
let randomNum;

function getRandomNum() {
    return Math.ceil(Math.random() * 20);
}

randomNum = getRandomNum();

function getSlideNext() {
    if (randomNum === 20) {
        randomNum = 0;
    }
    randomNum++;
    if (state.photoSource == 'GitHub') {
        setBg();
    } else if (state.photoSource == 'Unsplash') {
        getLinkUnsplash();
    } else if (state.photoSource == 'Flickr') {
        getLinkFlickr();
    }
    return randomNum;
}
slideNext.addEventListener('click', getSlideNext)

function getSlidePrev() {
    if (randomNum === 1) {
        randomNum = 21;
    }
    randomNum--;
    if (state.photoSource == 'GitHub') {
        setBg();
    } else if (state.photoSource == 'Unsplash') {
        getLinkUnsplash();
    } else if (state.photoSource == 'Flickr') {
        getLinkFlickr();
    }
    return randomNum;
}
slidePrev.addEventListener('click', getSlidePrev)

function setBg() {
    const timeOfDay = getTimeOfDay();
    const bgNum = String(randomNum).padStart(2, '0');
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/Leonid-Gru/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.addEventListener('load', () => {
        body.style.backgroundImage = `url(${img.src})`;
    });
}
setBg();

/* Weather */
window.addEventListener('beforeunload', () => {
    localStorage.setItem('city', myCity.value);
});

if (localStorage.getItem('city')) {
    myCity.value = localStorage.getItem('city');
} else {
    myCity.value = 'Minsk';
}

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${myCity.value}&lang=${state.language}&appid=08f2a575dda978b9c539199e54df03b0&units=metric`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.cod == 404 || myCity.value == '') {
        state.language == 'en' ?
            myCity.placeholder = 'Wrong city' :
            myCity.placeholder = 'Неверный город';
        myCity.value = '';
        weatherIcon.className = ``;
        temperature.textContent = ``;
        weatherDescription.textContent = ``;
        wind.textContent = ``;
        humidity.textContent = ``;
    } else {
        let valueWindSpeed = {
            'en': `Wind speed: ${Math.round(data.wind.speed)} m/s`,
            'ru': `Скорость ветра: ${Math.round(data.wind.speed)} м/c`,
        };
        let valueHumidity = {
            'en': `Humidity: ${data.main.humidity}%`,
            'ru': `Влажность: ${data.main.humidity}%`,
        };
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = valueWindSpeed[state.language];
        humidity.textContent = valueHumidity[state.language];
    }
}
myCity.addEventListener('change', getWeather);
getWeather();


/* Quotes */
async function getQuotes() {
    const quotes = `assets/json/data-${state.language}.json`;
    const res = await fetch(quotes);
    const data = await res.json();

    const quoteNum = Math.floor(Math.random() * data.length);
    quote.textContent = data[quoteNum].text;
    author.textContent = data[quoteNum].author;

    changeQuote.addEventListener('click', function () {
        const quoteNum = Math.floor(Math.random() * data.length);
        quote.textContent = data[quoteNum].text;
        author.textContent = data[quoteNum].author;
    });
}
getQuotes();

/* Audio player */
const audio = new Audio();
let isPlay = false;
let playNum = 0;

playList.forEach(song => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = song.title;
    playListContainer.append(li);
});

const playItems = document.querySelectorAll('.play-item');

function playAudio() {
    audio.src = playList[playNum].src;
    audio.currentTime = playNum;
    playItems[playNum].classList.add('item-active');
    if (!isPlay) {
        audio.play();
        isPlay = true;
    } else {
        audio.pause();
        isPlay = false;
    }
}
play.addEventListener('click', playAudio);

function toggleBtn() {
    if (isPlay) {
        play.classList.add('pause');
    } else {
        play.classList.remove('pause');
    }
}
play.addEventListener('click', toggleBtn);

function playNext() {
    playItems[playNum].classList.remove('item-active');
    if (playNum === playList.length - 1) {
        playNum = -1;
    }
    playNum++;
    isPlay = false;
    playAudio();
    toggleBtn();
    return playNum;
}
nextSong.addEventListener('click', playNext);

function playPrev() {
    playItems[playNum].classList.remove('item-active');
    if (playNum === 0) {
        playNum = playList.length;
    }
    playNum--;
    isPlay = false;
    playAudio();
    toggleBtn();
    return playNum;
}
prevSong.addEventListener('click', playPrev);

/* Images API */

async function getLinkUnsplash() {
    const timeOfDay = getTimeOfDay();
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${timeOfDay}&client_id=94H13Na1KA2E1XlGlcfh9Baw2TziuwgtQ7qCzHdux3o`;
    const res = await fetch(url);
    const data = await res.json();
    const img = new Image();
    img.src = data.urls.regular;
    img.addEventListener('load', () => {
        body.style.backgroundImage = `url(${img.src})`;
        body.style.backgroundSize = `cover`;
    });
}

async function getLinkFlickr() {
    const timeOfDay = getTimeOfDay();
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=e4bd3f56180272639486c73e16b53963&tags=${timeOfDay}&extras=url_l&format=json&nojsoncallback=1`;
    const res = await fetch(url);
    const data = await res.json();
    const img = new Image();
    img.src = data.photos.photo[Math.ceil(Math.random() * 100)].url_l;
    img.addEventListener('load', () => {
        body.style.backgroundImage = `url(${img.src})`;
        body.style.backgroundSize = `cover`;
    });
}
