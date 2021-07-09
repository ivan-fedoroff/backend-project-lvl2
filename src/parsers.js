import yaml from 'js-yaml';

const chooseParser = (format) => {
  if (format === 'json') {
    return JSON.parse;
  }
  return yaml.load;
};

export default (data, format) => {
  const obj = chooseParser(format)(data);
  return obj;
};
