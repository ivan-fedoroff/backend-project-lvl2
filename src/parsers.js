import * as fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import _ from 'lodash';

const getAbsolutePath = (filepath) => {
  const newPath = path.isAbsolute(filepath) ? filepath : path.resolve(filepath);
  return newPath;
};

const chooseParser = (format) => {
  if (format === 'json') {
    return JSON.parse;
  }
  return yaml.safeLoad;
};

export default (filepath) => {
  const format = path.extname(filepath);
  const data = fs.readFileSync(getAbsolutePath(filepath), 'utf-8');
  const obj = chooseParser(format)(data);
  const arr = Object.keys(obj).map((key) => [key, obj[key]]);
  return _.sortBy(arr, [0]);
};
