import $ from 'jquery';
import moment from 'moment';

const apiEndpoint = 'https://api.chucknorris.io/jokes/';
const categoriesEndpoint = `${apiEndpoint}categories`;
const randomJokeEndpoint = `${apiEndpoint}random`;
const searchEndpoint = `${apiEndpoint}search`;

const $jokeContainer = $('#joke-container');
const $categoryTags = $('#category-tags');
const $favoritesContainer = $('#favorites-container');

let jokesResult = null;
let favouriteJokes = [];

export const getRandomJoke = () => {
    $jokeContainer.empty();
    $.get(randomJokeEndpoint, (joke) => {
        jokesResult = joke
        generateResultBlock(joke);
    });
}

export const getCategories = () => {
    $.get(categoriesEndpoint, function (categories) {
        categories.forEach(function (category) {
            $categoryTags.append(`<span class="category-tag" data-category="${category}">${category}</span>`);
        });
    });
}

export const getJokeByCategory = (category) => {
    const url = `${apiEndpoint}random?category=${category}`;
    $jokeContainer.empty();
    $.get(url, (joke) => {
        jokesResult = joke
        generateResultBlock(joke);
    });
}

export const searchJokes = (query) => {
    const url = `${searchEndpoint}?query=${encodeURIComponent(query)}`;
    $jokeContainer.empty();
    $.get(url, (data) => {
        const jokes = data.result;
        if (jokes.length === 0) {
            $jokeContainer.append('<h3>No jokes found</h3>');
        } else {
            jokesResult = jokes
            $.each(jokes, (index, joke) => {
                generateResultBlock(joke);
            });
        }
    });
}

export const generateResultBlock = (joke) => {
    const isFavorite = favouriteJokes.some(fav => fav.id === joke.id);
    const $card = $('<div>').addClass('w-100').html(`
        <div class="mx-auto mt-12 w-100 rounded bg-light py-5 px-5">
            <img src="icons/${isFavorite ? 'heart-red' : 'heart'}.svg" width="20" height="17" class="favorite-icon d-block ms-auto" alt="heart icon" data-jokeid="${joke.id}">
            <div class="d-flex gap-2">
                <div>
                    <div class="rounded-circle bg-white p-2">
                        <img src="icons/message.svg" alt="message icon">
                    </div>
                </div>
                <div class="w-100 ms-2">
                    <h6 class="h6">
                        ID: <a target="_blank" href="${joke.url}" class="text-primary">${joke.id}</a>
                        <svg width="15" height="15" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.54551 0H5.90915C5.65812 0 5.4546 0.203515 5.4546 0.45455C5.4546 0.705585 5.65812 0.9091 5.90915 0.9091H8.44815L3.76958 5.58768C3.5921 5.76516 3.5921 6.05298 3.76958 6.2305C3.85832 6.31923 3.97464 6.36362 4.09097 6.36362C4.2073 6.36362 4.32365 6.31923 4.41236 6.23048L9.09098 1.55191V4.09091C9.09098 4.34194 9.2945 4.54546 9.54553 4.54546C9.79657 4.54546 10.0001 4.34194 10.0001 4.09091V0.45455C10.0001 0.203515 9.79655 0 9.54551 0Z" fill="#8EA7FF"/>
                            <path d="M7.72725 4.54544C7.47622 4.54544 7.2727 4.74895 7.2727 4.99999V9.0909H0.90908V2.72726H4.99999C5.25103 2.72726 5.45454 2.52374 5.45454 2.27271C5.45454 2.02167 5.25103 1.81818 4.99999 1.81818H0.45455C0.203515 1.81818 0 2.02169 0 2.27273V9.54545C0 9.79646 0.203515 9.99998 0.45455 9.99998H7.72727C7.97831 9.99998 8.18182 9.79646 8.18182 9.54543V4.99999C8.1818 4.74895 7.97829 4.54544 7.72725 4.54544Z" fill="#8EA7FF"/>
                        </svg>
                    </h6>
                    <div>${joke.value}</div>
                    <div class="mt-4 d-flex align-items-center justify-content-between">
                        <p class="font-medium text-secondary favorite-update-time">Last update: ${moment().startOf('hour').fromNow()}</p>
                        ${joke.categories && joke.categories.length > 0 ? `<div class="rounded bg-white px-3 py-0.5 font-medium text-uppercase">${joke.categories[0]}</div>` : ''}
                </div>
            </div>
        </div>
        </div>`);

    $card.find('.favorite-icon').on('click', function () {
        toggleFavorite(joke);
        $(this).attr('src', `icons/${!isFavorite ? 'heart' : 'heart-red'}.svg`).data('isfavorite', !isFavorite);
    });

    $jokeContainer.append($card);
}

export const generateFavoriteBlock = (joke) => {
    const $card = $('<div>').html(`<div class="mx-auto mt-12 w-100 rounded bg-white py-4 px-3">
        <img src="icons/heart-red.svg"  width="20" height="17" class="favorite-icon d-block ms-auto" alt="heart icon">
            <div class="d-flex gap-2">
                <div>
                    <div class="rounded-circle bg-light p-2">
                        <img src="icons/message.svg" alt="message icon">
                    </div>
                </div>
                <div class="w-100 ms-2">
                    <h6 class="h6">
                        ID: <a target="_blank" href="${joke.url}" class="text-primary">${joke.id}</a>
                        <svg width="15" height="15" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.54551 0H5.90915C5.65812 0 5.4546 0.203515 5.4546 0.45455C5.4546 0.705585 5.65812 0.9091 5.90915 0.9091H8.44815L3.76958 5.58768C3.5921 5.76516 3.5921 6.05298 3.76958 6.2305C3.85832 6.31923 3.97464 6.36362 4.09097 6.36362C4.2073 6.36362 4.32365 6.31923 4.41236 6.23048L9.09098 1.55191V4.09091C9.09098 4.34194 9.2945 4.54546 9.54553 4.54546C9.79657 4.54546 10.0001 4.34194 10.0001 4.09091V0.45455C10.0001 0.203515 9.79655 0 9.54551 0Z" fill="#8EA7FF"/>
                            <path d="M7.72725 4.54544C7.47622 4.54544 7.2727 4.74895 7.2727 4.99999V9.0909H0.90908V2.72726H4.99999C5.25103 2.72726 5.45454 2.52374 5.45454 2.27271C5.45454 2.02167 5.25103 1.81818 4.99999 1.81818H0.45455C0.203515 1.81818 0 2.02169 0 2.27273V9.54545C0 9.79646 0.203515 9.99998 0.45455 9.99998H7.72727C7.97831 9.99998 8.18182 9.79646 8.18182 9.54543V4.99999C8.1818 4.74895 7.97829 4.54544 7.72725 4.54544Z" fill="#8EA7FF"/>
                        </svg>
                    </h6>
                    <div>${joke.value}</div>
                    <div class="mt-4 d-flex align-items-center justify-content-between">
                        <p class="font-medium text-secondary favorite-update-time">Last update: ${moment().startOf('hour').fromNow()}</p>
                        ${joke.categories && joke.categories.length > 0 ? `<div class="rounded bg-white px-3 py-0.5 font-medium text-uppercase">${joke.categories[0]}</div>` : ''}
                    </div>
                </div>
            </div>
        </div>`);

    $card.find('.favorite-icon').on('click', function () {
        toggleFavorite(joke);
        $(this).attr('src', 'icons/heart.svg').data('isfavorite', false);
    });

    $favoritesContainer.append($card);
}

export const toggleFavorite = (joke) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const index = favorites.findIndex(fav => fav.id === joke.id);
    if (index === -1) {
        favorites.push(joke);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites();
    $jokeContainer.empty();
    if (jokesResult?.length > 0) {
        $.each(jokesResult, (index, joke) => {
            generateResultBlock(joke);
        });
    } else {
        generateResultBlock(joke);
    }
}

export const showFavorites = (joke) => {
    const favorites = favouriteJokes = JSON.parse(localStorage.getItem('favorites')) || [];
    $favoritesContainer.empty();
    if (favorites.length === 0) {
        $favoritesContainer.append('<h6>No favorite jokes yet</h6>');
    } else {
        $.each(favorites, function (index, joke) {
            generateFavoriteBlock(joke);
        });
    }
}

$(document).ready(function () {
    getCategories();
    showFavorites();

    $('#get-joke-btn').click(function (event) {
        event.preventDefault();
        const menuOption = $('input[name=\'menu\']:checked').val();
        switch (menuOption) {
            case 'random':
                getRandomJoke();
                break;
            case 'categories':
                const category = $('#category-tags .active').attr('data-category');
                if (category !== undefined) {
                    getJokeByCategory(category);
                }
                break;
            case 'search':
                const query = $('#search-input').val();
                if (query !== '') {
                    searchJokes(query);
                }
                break;
        }
    });

    $('#search-input').hide();
    $categoryTags.hide().on('click', '.category-tag', function () {
        $('#category-tags .category-tag').removeClass('active');
        $(this).addClass('active');
        $('#get-joke-btn').prop('disabled', false);
    });

    $('input[type=radio][name=menu]').change(function () {
        if (this.value === 'search') {
            $('#search-input').show();
            $categoryTags.hide();
        } else if (this.value === 'categories') {
            $categoryTags.show();
            $('#search-input').hide();
        } else if (this.value === 'random') {
            $('#search-input').hide();
            $categoryTags.hide();
        }
    });

    $(document).ready(function () {
        $('.block-right-toggle').click(function () {
            $('.block-right').toggleClass('show');
        });
    });
});
