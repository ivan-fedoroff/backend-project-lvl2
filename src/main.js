// eslint object-curly-newline: ["error", { "multiline": true }]
// eslint-env es6

import _ from 'lodash';
import path from 'path';
import parse from './parsers.js';
import readFile from './reader.js';
import getStylishDiff from '../formatters/stylish.js';
import getPlainDiff from '../formatters/plain.js';
import getJsonDiff from '../formatters/json.js';

const getDiffInArr = (obj1, obj2) => {
  const unionKeys = Object.keys({ ...obj1, ...obj2 });
  const sortedKeys = _.sortBy(unionKeys, (key) => key);
  const diff = sortedKeys.reduce((acc, key) => {
    if (!(key in obj2)) {
      return [...acc, { name: key, value: obj1[key], state: 'removed' }];
    }
    if (!(key in obj1)) {
      return [...acc, { name: key, value: obj2[key], state: 'added' }];
    }
    if (_.isEqual(obj1[key], obj2[key])) {
      return [...acc, { name: key, value: obj1[key], state: 'unchanged' }];
    }
    if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
      return [...acc, { name: key, state: 'hadChildren', children: getDiffInArr(obj1[key], obj2[key]) }];
    }

    return [...acc, {
      name: key, value: obj2[key], oldValue: obj1[key], state: 'updated',
    }];
  }, []);
  return diff;
};

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const extend1 = path.extname(filepath1);
  const extend2 = path.extname(filepath2);
  const data1 = readFile(filepath1);
  const data2 = readFile(filepath2);
  const obj1 = parse(data1, extend1);
  const obj2 = parse(data2, extend2);
  const diffInArr = getDiffInArr(obj1, obj2);
  const formatter = (type) => {
    if (type === 'plain') {
      return getPlainDiff(diffInArr);
    }
    if (type === 'json') {
      return getJsonDiff(diffInArr);
    }
    return getStylishDiff(diffInArr);
  };
  return formatter(formatName);
};

export default genDiff;
