import _ from 'lodash';

const newline = '\n';
const tab = '  ';

const getStrFromObj = (obj, n) => {
  const keys = Object.keys(obj);
  const sortedKeys = _.sortBy(keys, (key) => key);
  const cb = (acc, name) => {
    const value = _.isObject(obj[name]) ? getStrFromObj(obj[name], n + 2) : obj[name];
    return `${acc}${newline}${tab.repeat(n + 1)}${name}: ${value}`;
  };
  const strDiff = sortedKeys.reduce(cb, '{');
  return `${strDiff}${newline}${tab.repeat(n - 1)}}`;
};

const getValue = (value, n) => {
  const newValue = _.isObject(value) ? getStrFromObj(value, n + 2) : value;
  return newValue;
};

const getStylish = (arr, n = 1) => {
  const cb = (element) => {
    const {
      name, value, oldValue, state, children,
    } = element;
    if (state === 'removed') {
      return `${tab.repeat(n)}- ${name}: ${getValue(value, n)}`;
    }
    if (state === 'added') {
      return `${tab.repeat(n)}+ ${name}: ${getValue(value, n)}`;
    }
    if (state === 'unchanged') {
      return `${tab.repeat(n + 1)}${name}: ${getValue(value, n)}`;
    }
    if (state === 'hadChildren') {
      return `${tab.repeat(n + 1)}${name}: ${getStylish(children, n + 2)}`;
    }

    return `${tab.repeat(n)}- ${name}: ${getValue(oldValue, n)}
${tab.repeat(n)}+ ${name}: ${getValue(value, n)}`;
  };
  return `{${newline}${arr.flatMap(cb).join('\n')}${newline}${tab.repeat(n - 1)}}`;
};

export default getStylish;
