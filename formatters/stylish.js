import _ from 'lodash';

const newline = '\n';
const tab = '  ';

const getStrFromObj = (obj, n) => {
  const keys = Object.keys(obj).sort();
  const cb = (acc, key) => {
    const last = _.isObject(obj[key]) ? getStrFromObj(obj[key], n + 2) : obj[key];
    return `${acc}${newline}${tab.repeat(n + 1)}${key}: ${last}`;
  };
  const strDiff = keys.reduce(cb, '{');
  return `${strDiff}${newline}${tab.repeat(n - 1)}}`;
};

const getStylish = (arr, n = 1) => {
  const getValue = (value) => {
    if (_.isObject(value)) {
      return getStrFromObj(value, n + 2);
    }
    return value;
  };
  const cb = (acc, element) => {
    const { key, value1, value2, state } = element;
    const prefix = (state === 'unchanged' || state === 'hadChildren')
      ? `${newline}${tab.repeat(n + 1)}` : `${newline}${tab.repeat(n)}`;
    if (state === 'removed') {
      return `${acc}${prefix}- ${key}: ${getValue(value1)}`;
    }
    if (state === 'added') {
      return `${acc}${prefix}+ ${key}: ${getValue(value2)}`;
    }
    if (state === 'unchanged') {
      return `${acc}${prefix}${key}: ${getValue(value1)}`;
    }
    if (state === 'hadChildren') {
      return `${acc}${prefix}${key}: ${getStylish(value1, n + 2)}`;
    }

    return `${acc}${prefix}- ${key}: ${getValue(value1)}${prefix}+ ${key}: ${getValue(value2)}`;
  };
  const strDiff = `${arr.reduce(cb, '{')}${newline}${tab.repeat(n - 1)}}`;
  return strDiff;
};

export default getStylish;
