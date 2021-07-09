import _ from 'lodash';
import * as fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import getStylishDiff from '../formatters/stylish.js';
import getPlainDiff from '../formatters/plain.js';

const getAbsolutePath = (filepath) => path.resolve(filepath);

const getDiffInArr = (obj1, obj2) => {
  const unionKeys = Object.keys({ ...obj1, ...obj2 }).sort();
  const diff = unionKeys.reduce((acc, key) => {
    if (!(key in obj2)) {
      return [...acc, { key: [key], value1: obj1[key], state: 'removed' }];
    }
    if (!(key in obj1)) {
      return [...acc, { key: [key], value2: obj2[key], state: 'added' }];
    }
    if (_.isEqual(obj1[key], obj2[key])) {
      return [...acc, { key: [key], value1: obj1[key], state: 'unchanged' }];
    }
    if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
      return [...acc, { key: [key], value1: getDiffInArr(obj1[key], obj2[key]), state: 'hadChildren' }];
    }

    return [...acc, { key: [key], value1: obj1[key], value2: obj2[key], state: 'updated' }];
  }, []);
  return diff;
};

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const extend1 = path.extname(getAbsolutePath(filepath1));
  const extend2 = path.extname(getAbsolutePath(filepath2));
  const data1 = fs.readFileSync(getAbsolutePath(filepath1), 'utf-8');
  const data2 = fs.readFileSync(getAbsolutePath(filepath2), 'utf-8');
  const obj1 = parse(data1, extend1);
  const obj2 = parse(data2, extend2);
  const diffInArr = getDiffInArr(obj1, obj2);
  const formatter = (type) => {
    if (type === 'plain') {
      return getPlainDiff(diffInArr);
    }
    return getStylishDiff(diffInArr);
  };
  return formatter(formatName);
};

export default genDiff;
