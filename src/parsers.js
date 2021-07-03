import * as fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const getAbsolutePath = (filepath) => {
  const newPath = path.isAbsolute(filepath) ? filepath : path.resolve(filepath);
  return newPath;
};

const chooseParser = (format) => {
  if (format === 'json') {
    return JSON.parse;
  }
  return yaml.load;
};

export default (filepath) => {
  const format = path.extname(filepath);
  const data = fs.readFileSync(getAbsolutePath(filepath), 'utf-8');
  const obj = chooseParser(format)(data);
  return obj;
};
