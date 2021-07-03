import _ from 'lodash';

const stylish = (obj, n = 1) => {
  const newline = '\n';
  const tab = '  ';
  const cb = (acc, key) => {
    const last = _.isObject(obj[key]) ? stylish(obj[key], n + 2) : obj[key];
    const space = key.startsWith(' ', 1) ? tab.repeat(n) : tab.repeat(n + 1);
    return `${acc}${newline}${space}${key}: ${last}`;
  };
  const strDiff = `${Object.keys(obj).reduce(cb, '{')}${newline}${tab.repeat(n - 1)}}`;
  return strDiff;
};

export default stylish;
