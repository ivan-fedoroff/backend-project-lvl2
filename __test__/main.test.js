import { test } from '@jest/globals';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import genDiff from '../src/main.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const filepath1 = getFixturePath('file1.json');
const filepath2 = getFixturePath('file2.json');
const filepathExceptions1 = getFixturePath('fileWithExceptions1.json');
const filepathExceptions2 = getFixturePath('fileWithExceptions2.json');
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
  expect(genDiff(filepath1, filepath2)).toEqual(rightResult);
  expect(genDiff(filepathExceptions1, filepathExceptions2)).toEqual(resultWithExceptions);
});

test('getAbsolutePath work', () => {
  expect(genDiff(filepath1, '__fixtures__/file2.json')).toEqual(rightResult);
});

test('Wrong path', () => {
  expect(() => genDiff(filepath1, fileForFail)).toThrow();
  expect(() => genDiff(filepath1, dirpath)).toThrow();
});
