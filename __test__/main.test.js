import { expect, test } from '@jest/globals';
import path, { dirname } from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
// import yaml from 'js-yaml';
import genDiff from '../src/main.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const filepathJSON1 = getFixturePath('file1.json');
const filepathJSON2 = getFixturePath('file2.json');
const filepathYML1 = getFixturePath('file1.yml');
const filepathYML2 = getFixturePath('file2.yml');
const dirpath = getFixturePath('faildir');
const fileForFail = getFixturePath('undefined');
const stylishRightDiff = fs.readFileSync(getFixturePath('result_stylish.txt'), 'utf8');

const plainRightDiff = fs.readFileSync(getFixturePath('result_plain.txt'), 'utf8');

const jsonDiff = fs.readFileSync(getFixturePath('result_JSON.json'), 'utf8');

test('Main stylish work', () => {
  expect(genDiff(filepathJSON1, filepathJSON2)).toEqual(stylishRightDiff);
  expect(genDiff(filepathYML1, filepathYML2)).toEqual(stylishRightDiff);
});

test('Plain work', () => {
  expect(genDiff(filepathJSON1, filepathJSON2, 'plain')).toEqual(plainRightDiff);
  expect(genDiff(filepathYML1, filepathYML2, 'plain')).toEqual(plainRightDiff);
});

test('Json work', () => {
  expect(genDiff(filepathJSON1, filepathJSON2, 'json')).toEqual(jsonDiff);
  expect(genDiff(filepathYML1, filepathYML2, 'json')).toEqual(jsonDiff);
});

test('getAbsolutePath work', () => {
  expect(genDiff(filepathJSON1, '__fixtures__/file2.json')).toEqual(stylishRightDiff);
  expect(genDiff(filepathYML1, '__fixtures__/file2.yml')).toEqual(stylishRightDiff);
});

test('Wrong path', () => {
  expect(() => genDiff(filepathJSON1, fileForFail)).toThrow();
  expect(() => genDiff(filepathJSON1, dirpath)).toThrow();
});
