// index.mjs
import * as fs from 'fs';
import path from 'path';
import _ from 'lodash';

const getNormalizePath = (filepath) => {
  const newPath = path.isAbsolute(filepath) ? filepath : path.resolve(process.cwd(), filepath);
  return newPath;
};

const getArrFromJSON = (filepath) => {
  const data = fs.readFileSync(getNormalizePath(filepath), 'utf-8');
  const obj = JSON.parse(data);
  const arr = Object.keys(obj).map((key) => [key, obj[key]]);
  return _.sortBy(arr, [0]);
};

const genDiff = (filepath1, filepath2) => {
  const arr1 = getArrFromJSON(filepath1);
  const arr1Length = arr1.length;
  const bigArr = arr1.concat(getArrFromJSON(filepath2));
  const agregator = (acc, el, index, arr) => {
    if (index < arr1Length) {
      const newArr = arr.slice(arr1Length);
      const newEl = newArr.filter((element) => element.includes(el[0])).flat();
      if (newEl.length < 1) {
        return `${acc}
  - ${el[0]}: ${el[1]}`;
      }
      if (_.isEqual(newEl[1], el[1])) {
        return `${acc}
    ${el[0]}: ${el[1]}`;
      }
      return `${acc}
  - ${el[0]}: ${el[1]}
  + ${newEl[0]}: ${newEl[1]}`;
    }
    const newArr = arr.slice(0, arr1Length);
    const newEl = newArr.filter((element) => element.includes(el[0]));
    if (newEl.length < 1) {
      return `${acc}
  + ${el[0]}: ${el[1]}`;
    }
    return acc;
  };
  const diff = `${bigArr.reduce(agregator, '{')}
}`;

  return diff;
};

export default genDiff;
