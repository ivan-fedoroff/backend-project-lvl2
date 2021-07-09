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

const getName = (arr, currentName) => {
  const iter = (node, ancestry) => {
    const { name, value } = node;
    const newAncestry = [...ancestry, name];
    if (!Array.isArray(value)) { // is node?
      return (name === currentName) ? newAncestry.join('.') : [];// return new path or nothing
    }

    return value.flatMap((child) => iter(child, newAncestry));// process interior node
  };

  return arr.flatMap((element) => iter(element, []));
};
const getFilter = (arr) => arr.filter(({ state }) => state !== 'unchanged');

const getPlain = (arr) => {
  const filteredArr = getFilter(arr);

  const cb = (element) => {
    const { name, value, oldValue, state } = element;
    const getEnd = () => {
      if (state === 'added') {
        return ` with value: ${getValue(value)}`;
      }
      if (state === 'updated') {
        return `. From ${getValue(oldValue)} to ${getValue(value)}`;
      }
      return '';
    };

    if (state !== 'hadChildren') {
      return `Property '${getName(arr, name)}' was ${state}${getEnd(state)}`;
    }

    return getFilter(value).flatMap(cb).join('\n');
  };

  const strDiff = filteredArr.flatMap(cb).join('\n');
  return strDiff;
};
export default getPlain;
