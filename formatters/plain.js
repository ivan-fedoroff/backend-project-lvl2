import _ from 'lodash';

const getValue = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }
  return value;
};

const getFilter = (arr) => arr.filter(({ state }) => state !== 'unchanged');

const getPlain = (arr) => {
  const removeUnchanged = getFilter(arr);
  const iter = (node, ancestry) => {
    const {
      name, value, oldValue, state, children,
    } = node;
    const newAncestry = [...ancestry, name];
    const getEnd = () => {
      if (state === 'added') {
        return ` with value: ${getValue(value)}`;
      }
      if (state === 'updated') {
        return `. From ${getValue(oldValue)} to ${getValue(value)}`;
      }
      return '';
    };

    if (state !== 'hadChildren') {
      return `Property '${newAncestry.join('.')}' was ${state}${getEnd(state)}`;
    }

    return getFilter(children).flatMap((child) => iter(child, newAncestry)).join('\n');
  };

  const strDiff = removeUnchanged.flatMap((element) => iter(element, [])).join('\n');
  return strDiff;
};
export default getPlain;
