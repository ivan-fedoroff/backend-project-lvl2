import _ from 'lodash';

const getValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const getName = (arr, currentKey) => {
  const iter = (node, ancestry) => {
    const { key, value1 } = node;
    const newAncestry = [...ancestry, key];
    if (!Array.isArray(value1)) { // is node?
      return (key === currentKey) ? newAncestry.join('.') : [];// return new path or nothing
    }

    return value1.flatMap((child) => iter(child, newAncestry));// process interior node
  };

  return arr.flatMap((element) => iter(element, []));
};
const getFilter = (arr) => arr.filter(({ state }) => state !== 'unchanged');

const getPlain = (arr) => {
  const filteredArr = getFilter(arr);

  const cb = (element) => {
    const { key, value1, value2, state } = element;
    const getEnd = () => {
      if (state === 'added') {
        return ` with value: ${getValue(value2)}`;
      }
      if (state === 'updated') {
        return `. From ${getValue(value1)} to ${getValue(value2)}`;
      }
      return '';
    };

    if (state !== 'hadChildren') {
      return `Property '${getName(arr, key)}' was ${state}${getEnd(state)}`;
    }

    return getFilter(value1).flatMap(cb).join('\n');
  };

  const strDiff = filteredArr.flatMap(cb).join('\n');
  return strDiff;
};
export default getPlain;
