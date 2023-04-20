// const {getRandomJoke} = require('./js/index');
import $ from 'jquery';
import { getRandomJoke, toggleFavorite  } from '../src/js/index';

describe('toggleFavorite', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should add the joke to favorites if it is not already favorited', () => {
        const joke = {
            id: 1,
            value: 'Why did the tomato turn red? Because it saw the salad dressing!',
        };
        toggleFavorite(joke);
        expect(JSON.parse(localStorage.getItem('favorites'))).toEqual([joke]);
    });

    it('should remove the joke from favorites if it is already favorited', () => {
        const joke1 = {
            id: 1,
            value: 'Why did the tomato turn red? Because it saw the salad dressing!',
        };
        const joke2 = {
            id: 2,
            value: 'Why did the chicken cross the playground? To get to the other slide.',
        };
        localStorage.setItem('favorites', JSON.stringify([joke1, joke2]));
        toggleFavorite(joke1);
        expect(JSON.parse(localStorage.getItem('favorites'))).toEqual([joke2]);
    });
});
