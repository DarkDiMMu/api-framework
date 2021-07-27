import CoreApi from '../http/CoreApi';
import getRandomInt from './getRandomInt';
import { Cat } from '../../@types/common';

async function getRandomCat(): Promise<{ cat: Cat; status: number }> {
  const response = await CoreApi.getAllCats();
  const randomGroup = response.data.groups[getRandomInt(response.data.groups.length)];
  return {
    cat: randomGroup.cats[getRandomInt(randomGroup.count)],
    status: response.status,
  };
}

export default getRandomCat;
