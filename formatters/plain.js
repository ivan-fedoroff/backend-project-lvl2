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

const getName = (arr, currentName) => {
  const iter = (node, ancestry) => {
    const { name, children } = node;
    const newAncestry = [...ancestry, name];
    if (!children) { // is node?
      return (name === currentName) ? newAncestry.join('.') : [];// return full path or clear path
    }

    return children.flatMap((child) => iter(child, newAncestry));// process interior node
  };

  return arr.flatMap((element) => iter(element, []));
};
const getFilter = (arr) => arr.filter(({ state }) => state !== 'unchanged');

const getPlain = (arr) => {
  const removeUnchanged = getFilter(arr);
  const cb = ({ name, value, oldValue, state, children }) => {
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
      return `Property '${getName(arr, name)}' was ${state}${getEnd(state)}`;
    }

    return getFilter(children).flatMap(cb).join('\n');
  };

  const strDiff = removeUnchanged.flatMap(cb).join('\n');
  return strDiff;
};
export default getPlain;
