import { allure } from 'allure-mocha/runtime';
import CoreApi from '../http/CoreApi';
import { assert } from 'chai';
import { AxiosResponse } from 'axios';
import { Cat } from '../../@types/common';

export default class Steps {
  public static common = {
    stepGetCatById: Steps.getCatById,
    equal: Steps.equal,
  };
  private static async getCatById(id: number): Promise<AxiosResponse<{ cat: Cat }>> {
    return await allure.step(`выполнен запрос GET /get-by-id c параметром ${id}`, async () => {
      console.info('выполняется запрос GET /get-by-id');
      const response = await CoreApi.getCatById(id);
      const data = JSON.stringify(response.data, null, 2);
      console.info('получен ответ на запрос GET /get-by-id:\n', data);
      allure.attachment('attachment', data, 'application/json');
      console.info('получен ответ на запрос GET /get-by-id:\n', response.data);
      return response;
    });
  }

  private static async equal(exp: any, act: any) {
    return await allure.step('выполнена проверка соответствия значений', () => {
      allure.attachment('expected', exp.toString(), 'text/plain');
      allure.attachment('actual', act.toString(), 'text/plain');
      assert.strictEqual(exp, act, 'Значения не соответствуют');
    });
  }
}
