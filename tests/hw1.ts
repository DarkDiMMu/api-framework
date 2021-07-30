import CoreApi from '../src/http/CoreApi';
import { assert } from 'chai';
import { it } from 'mocha';
import GetRandomCat from '../src/utils/getRandomCat';
import { allure } from 'allure-mocha/runtime';
import Steps from '../src/steps/Steps';
import addHeader from '../src/utils/addHeader';

describe('Домашнее задание (основное)', () => {
  let randomCat: { cat: any; status: any };

  after(async () => {
    addHeader('Прибираем за собой!')

    // вернем удаленного котика назад)
    const cat = randomCat.cat;
    console.info('Попытка добавить котика обратно...');
    const response = await CoreApi.addCat([
      { name: cat.name, description: cat.description, gender: cat.gender },
    ]);

    if (response.data.cats[0].errorDescription) console.log('Кот не добавлен, такой кот уже есть');
    else console.log('Кот добавлен');
  });

  it('Найден случайный котик', async () => {
    randomCat = await GetRandomCat.withReport();
    assert.equal(randomCat.status, 200, 'Кот не найден!');
  });

  it('Удален найденный котик', async () => {
    addHeader('pt2: Remove random cat');

    allure.link(
      'https://meowle.qa-fintech.ru/api/core/api-docs-ui/#/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5/delete_cats__catId__remove',
      '{catId}/remove'
    );
    const response = await allure.step(
      `выполнен запрос DELETE {catId}/remove c параметром ${randomCat.cat.id}`,
      async () => {
        console.info('выполняется запрос DELETE {catId}/remove');
        const response = await CoreApi.removeCat(randomCat.cat.id);
        const data = JSON.stringify(response.data, null, 2);
        console.info('получен ответ на запрос DELETE {catId}/remove:\n', data);
        allure.attachment('Удаленный кот', data, 'application/json');

        return response;
      }
    );

    assert.equal(response.status, 200, 'Кот не был удален!');
  });

  it('Удаленный котик отсутствует', async () => {
    addHeader("pt3: Check removed cat doesn't exist");

    allure.link(
      'https://meowle.qa-fintech.ru/api/core/api-docs-ui/#/%D0%9F%D0%BE%D0%B8%D1%81%D0%BA/get_cats_get_by_id',
      'get_by_id'
    );
    allure.feature('Получение котика по id');

    const response = await Steps.common.stepGetCatById(randomCat.cat.id);
    await allure.step(
      'выполнена проверка соответствия значения имен кота из запроса с ожидаемым',
      async () => await Steps.common.equal(response.status, 404)
    );
  });
});
