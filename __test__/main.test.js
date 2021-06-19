import { expect, test } from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/main.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const filepathJSON1 = getFixturePath('file1.json');
const filepathJSON2 = getFixturePath('file2.json');
const filepathExceptions1 = getFixturePath('fileWithExceptions1.json');
const filepathExceptions2 = getFixturePath('fileWithExceptions2.json');
const filepathYML1 = getFixturePath('file1.yml');
const filepathYML2 = getFixturePath('file2.yml');
const dirpath = getFixturePath('faildir');
const fileForFail = getFixturePath('undefined');
const rightResult = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;
const resultWithExceptions = `{
  - follow: false
  + follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
    timeout: null
  + verbose: true
}`;

test('Main work', () => {
  expect(genDiff(filepathJSON1, filepathJSON2)).toEqual(rightResult);
  expect(genDiff(filepathYML1, filepathYML2)).toEqual(rightResult);
  expect(genDiff(filepathExceptions1, filepathExceptions2)).toEqual(resultWithExceptions);
});

test('getAbsolutePath work', () => {
  expect(genDiff(filepathJSON1, '__fixtures__/file2.json')).toEqual(rightResult);
});

test('Wrong path', () => {
  expect(() => genDiff(filepathJSON1, fileForFail)).toThrow();
  expect(() => genDiff(filepathJSON1, dirpath)).toThrow();
});
