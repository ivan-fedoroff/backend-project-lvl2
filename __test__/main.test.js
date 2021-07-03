import { expect, test } from '@jest/globals';
import path, { dirname } from 'path';
// import * as fs from 'fs';
import { fileURLToPath } from 'url';
// import yaml from 'js-yaml';
import genDiff from '../src/main.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const filepathJSON1 = getFixturePath('file1.json');
const filepathJSON2 = getFixturePath('file2.json');
// const filepathExceptions1 = getFixturePath('fileWithExceptions1.json');
// const filepathExceptions2 = getFixturePath('fileWithExceptions2.json');
const filepathYML1 = getFixturePath('file1.yml');
const filepathYML2 = getFixturePath('file2.yml');
const dirpath = getFixturePath('faildir');
const fileForFail = getFixturePath('undefined');
const rightResult = `{
    common: {
      + follow: false
        setting1: Value 1
      - setting2: 200
      - setting3: true
      + setting3: null
      + setting4: blah blah
      + setting5: {
            key5: value5
        }
        setting6: {
            doge: {
              - wow: 
              + wow: so much
            }
            key: value
          + ops: vops
        }
    }
    group1: {
      - baz: bas
      + baz: bars
        foo: bar
      - nest: {
            key: value
        }
      + nest: str
    }
  - group2: {
        abc: 12345
        deep: {
            id: 45
        }
    }
  + group3: {
        deep: {
            id: {
                number: 45
            }
        }
        fee: 100500
    }
}`;
/* const resultWithExceptions = `{
  - follow: false
  + follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
    timeout:
  + verbose: true
}`; */

test('Main work', () => {
  expect(genDiff(filepathJSON1, filepathJSON2)).toEqual(rightResult);
  expect(genDiff(filepathYML1, filepathYML2)).toEqual(rightResult);
// expect(genDiff(filepathExceptions1, filepathExceptions2)).toEqual(resultWithExceptions);
});

test('getAbsolutePath work', () => {
  expect(genDiff(filepathJSON1, '__fixtures__/file2.json')).toEqual(rightResult);
  expect(genDiff(filepathYML1, '__fixtures__/file2.yml')).toEqual(rightResult);
});

test('Wrong path', () => {
  expect(() => genDiff(filepathJSON1, fileForFail)).toThrow();
  expect(() => genDiff(filepathJSON1, dirpath)).toThrow();
});
