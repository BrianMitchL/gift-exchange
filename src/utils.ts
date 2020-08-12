import { Person } from './models';

export const personArrayOfLength = (length: number): Person[] =>
  new Array(length).fill(true).map((_, i) => ({ name: '' + (i + 1) }));

export const shuffle = (array: any[]) => {
  let i = array.length;
  let j;

  while (i !== 0) {
    j = Math.floor(Math.random() * i);
    i -= 1;

    const swap = array[i];
    array[i] = array[j];
    array[j] = swap;
  }

  return array;
};
