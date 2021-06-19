import _ from 'lodash';
import parse from './parsers.js';

const genDiff = (filepath1, filepath2) => {
  const arr1 = parse(filepath1);
  const arr1Length = arr1.length;
  const bigArr = arr1.concat(parse(filepath2));
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
