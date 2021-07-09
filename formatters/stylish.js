import _ from 'lodash';

const newline = '\n';
const tab = '  ';

const getStrFromObj = (obj, n) => {
  const keys = Object.keys(obj).sort();
  const cb = (acc, name) => {
    const last = _.isObject(obj[name]) ? getStrFromObj(obj[name], n + 2) : obj[name];
    return `${acc}${newline}${tab.repeat(n + 1)}${name}: ${last}`;
  };
  const strDiff = keys.reduce(cb, '{');
  return `${strDiff}${newline}${tab.repeat(n - 1)}}`;
};

const getValue = (value, n) => {
  const newValue = _.isObject(value) ? getStrFromObj(value, n + 2) : value;
  return newValue;
};

const getStylish = (arr, n = 1) => {
  const cb = (acc, element) => {
    const { name, value, oldValue, state } = element;
    const prefix = (state === 'unchanged' || state === 'hadChildren')
      ? `${newline}${tab.repeat(n + 1)}` : `${newline}${tab.repeat(n)}`;
    if (state === 'removed') {
      return `${acc}${prefix}- ${name}: ${getValue(value, n)}`;
    }
    if (state === 'added') {
      return `${acc}${prefix}+ ${name}: ${getValue(value, n)}`;
    }
    if (state === 'unchanged') {
      return `${acc}${prefix}${name}: ${getValue(value, n)}`;
    }
    if (state === 'hadChildren') {
      return `${acc}${prefix}${name}: ${getStylish(value, n + 2)}`;
    }

    return `${acc}${prefix}- ${name}: ${getValue(oldValue, n)}${prefix}+ ${name}: ${getValue(value, n)}`;
  };
  return `${arr.reduce(cb, '{')}${newline}${tab.repeat(n - 1)}}`;
};

export default getStylish;
