import { it } from 'mocha';
import GetRandomCat from '../src/utils/getRandomCat';
import { assert } from 'chai';
import addHeader from '../src/utils/addHeader';
import LikeApi from '../src/http/LikeApi';
import CoreApi from '../src/http/CoreApi';
import { allure } from 'allure-mocha/runtime';
import Steps from '../src/steps/Steps';

describe('Дополнительное домашнее задание 1', () => {
  let randomCat;
  let likes: number;
  let likesCount: number = 10;

  it('Найден случайный котик', async () => {
    randomCat = await GetRandomCat.withReport();
    assert.equal(randomCat.status, 200, 'Кот не найден!');
  });

  it('Сохранено кол-во лайков', async () => {
    addHeader('pt2: Save likes');
    likes = randomCat.cat.likes;
    console.log('Сохранены лайки нашего рандомного кота');
    assert.ok(true);
  });

  it(`Коту поставлено ${likesCount} лайков`, async () => {
    addHeader(`pt3: make ${likesCount} likes`);
    await Promise.all(
      Array(likesCount)
        .fill(null)
        .map((_) => LikeApi.likes(randomCat.cat.id, { like: true, dislike: false }))
    );
    console.log(`Коту поставлено ${likesCount} лайков`);
    assert.ok(true);
  });

  it(`У кота кол-во лайков увеличилось на ${likesCount}`, async () => {
    addHeader('pt4: check likes');
    console.log('Новый запрос нашего рандомного кота для получения актуального кол-ва лайков');
    const response = await CoreApi.getCatById(randomCat.cat.id);
    allure.step('обновленный кот', () => {
      allure.attachment('кот', JSON.stringify(response.data.cat, null, 2), 'application/json');
    });
    await Steps.common.equal(response.data.cat.likes, likes + likesCount);
  });
});
