import { it } from 'mocha';
import GetRandomCat from '../src/utils/getRandomCat';
import { assert } from 'chai';
import addHeader from '../src/utils/addHeader';
import LikeApi from '../src/http/LikeApi';
import CoreApi from '../src/http/CoreApi';
import { allure } from 'allure-mocha/runtime';
import Steps from '../src/steps/Steps';

describe('Дополнительное домашнее задание 2', () => {
  let randomCat;
  let dislikes: number;
  let dislikesCount: number = 8;

  after(async () => {
    if (dislikes > 0) {
      console.info(
        `удаляем кота, создаем нового такого же, ставим ему нужное кол-во дизлайков - ${dislikes}`
      );
      await CoreApi.removeCat(randomCat.cat.id);
      const response = await CoreApi.addCat([
        {
          name: randomCat.cat.name,
          description: randomCat.cat.description,
          gender: randomCat.cat.gender,
        },
      ]);
      await Promise.all(
        Array(dislikes)
          .fill(null)
          .map((_) => LikeApi.likes(response.data.cats[0].id, { like: false, dislike: true }))
      );
    }
  });

  it('Найден случайный котик', async () => {
    randomCat = await GetRandomCat.withReport();
    assert.equal(randomCat.status, 200, 'Кот не найден!');
  });

  it('Сохранено кол-во дизлайков', async () => {
    addHeader('pt2: Save dislikes');
    dislikes = randomCat.cat.dislikes;
    console.log('Сохранены дизлайки нашего рандомного кота');
    assert.ok(true);
  });

  it(`Коту поставлено ${dislikesCount} дизлайков`, async () => {
    addHeader(`pt3: make ${dislikesCount} dislikes`);
    await Promise.all(
      Array(dislikesCount)
        .fill(null)
        .map((_) => LikeApi.likes(randomCat.cat.id, { like: false, dislike: true }))
    );
    console.log(`Коту поставлено ${dislikesCount} дизлайков`);
    assert.ok(true);
  });

  it(`У кота кол-во дизлайков увеличилось на ${dislikesCount}`, async () => {
    addHeader('pt4: check dislikes');
    console.log('Новый запрос нашего рандомного кота для получения актуального кол-ва лайков');
    const response = await CoreApi.getCatById(randomCat.cat.id);
    allure.step('обновленный кот', () => {
      allure.attachment('кот', JSON.stringify(response.data.cat, null, 2), 'application/json');
    });
    await Steps.common.equal(response.data.cat.dislikes, dislikes + dislikesCount);
  });
});
