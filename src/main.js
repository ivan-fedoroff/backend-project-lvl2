import _ from 'lodash';
import parse from './parsers.js';
import stylish from './formatters.js';

const getDiffObj = (obj1, obj2) => {
  const diff = Object.keys(obj1).concat(Object.keys(obj2)).sort()
    .reduce((acc, key) => {
      if (!acc.includes(key)) {
        return [...acc, key];
      }
      return acc;
    }, [])
    .reduce((acc, key) => {
      if (key in obj1 && !(key in obj2)) {
        return { ...acc, [`- ${key}`]: obj1[key] };
      }
      if (!(key in obj1) && key in obj2) {
        return { ...acc, [`+ ${key}`]: obj2[key] };
      }
      if (_.isEqual(obj1[key], obj2[key])) {
        return { ...acc, [key]: obj1[key] };
      }
      if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
        return { ...acc, [key]: getDiffObj(obj1[key], obj2[key]) };
      }
      return { ...acc, [`- ${key}`]: obj1[key], [`+ ${key}`]: obj2[key] };
    }, {});
  return diff;
};

const genDiff = (filepath1, filepath2, format = 'stylish') => {
  const file1 = parse(filepath1);
  const file2 = parse(filepath2);
  const diffInObj = getDiffObj(file1, file2);
  const formatter = (type) => {
    if (type === 'stylish') {
      return stylish(diffInObj);
    }
    return stylish(diffInObj);
  };
  return formatter(format);
};

export default genDiff;
