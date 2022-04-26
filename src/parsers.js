import yaml from 'js-yaml';

const mapping = {
  yml: yaml.load,
  json: JSON.parse,
};

export default (data, format) => mapping[format](data);
