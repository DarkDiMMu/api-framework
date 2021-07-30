import CoreApi from '../http/CoreApi';
import getRandomInt from './getRandomInt';
import { Cat } from '../../@types/common';
import { allure } from 'allure-mocha/runtime';
import addHeader from './addHeader';

export default class GetRandomCat {
  static async withReport(): Promise<{ cat: Cat; status: number }> {
    const response = await CoreApi.getAllCats();
    const randomGroup = response.data.groups[getRandomInt(response.data.groups.length)];

    addHeader('pt1: Find random cat');

    console.info('Ждем рандомного кота...\n');
    const randomCat = randomGroup.cats[getRandomInt(randomGroup.count)];
    console.info('А вот и он! ↓');
    console.info(randomCat);

    allure.link(
      'https://meowle.qa-fintech.ru/api/core/api-docs-ui/#/%D0%9F%D0%BE%D0%B8%D1%81%D0%BA/get_cats_all',
      'all'
    );
    allure.logStep('выполнен запрос GET /all и выбран случайный котик');
    allure.testAttachment('Найденный котик', JSON.stringify(randomCat, null, 2), 'application/json');

    return {
      cat: randomCat,
      status: response.status,
    };
  }

  static async withoutReport(): Promise<{ cat: Cat; status: number }> {
    const response = await CoreApi.getAllCats();
    const randomGroup = response.data.groups[getRandomInt(response.data.groups.length)];
    return {
      cat: randomGroup.cats[getRandomInt(randomGroup.count)],
      status: response.status,
    };
  }
}
