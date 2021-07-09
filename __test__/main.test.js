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
const filepathYML1 = getFixturePath('file1.yml');
const filepathYML2 = getFixturePath('file2.yml');
const dirpath = getFixturePath('faildir');
const fileForFail = getFixturePath('undefined');
const stylishRightDiff = `{
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
const plainRightDiff = `Property 'common.follow' was added with value: false
Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to null
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with value: [complex value]
Property 'common.setting6.doge.wow' was updated. From '' to 'so much'
Property 'common.setting6.ops' was added with value: 'vops'
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From [complex value] to 'str'
Property 'group2' was removed
Property 'group3' was added with value: [complex value]`;

const jsonDiff = `[
  {
    "name": "common",
    "value": [
      {
        "name": "follow",
        "value": false,
        "state": "added"
      },
      {
        "name": "setting1",
        "value": "Value 1",
        "state": "unchanged"
      },
      {
        "name": "setting2",
        "value": 200,
        "state": "removed"
      },
      {
        "name": "setting3",
        "value": null,
        "oldValue": true,
        "state": "updated"
      },
      {
        "name": "setting4",
        "value": "blah blah",
        "state": "added"
      },
      {
        "name": "setting5",
        "value": {
          "key5": "value5"
        },
        "state": "added"
      },
      {
        "name": "setting6",
        "value": [
          {
            "name": "doge",
            "value": [
              {
                "name": "wow",
                "value": "so much",
                "oldValue": "",
                "state": "updated"
              }
            ],
            "state": "hadChildren"
          },
          {
            "name": "key",
            "value": "value",
            "state": "unchanged"
          },
          {
            "name": "ops",
            "value": "vops",
            "state": "added"
          }
        ],
        "state": "hadChildren"
      }
    ],
    "state": "hadChildren"
  },
  {
    "name": "group1",
    "value": [
      {
        "name": "baz",
        "value": "bars",
        "oldValue": "bas",
        "state": "updated"
      },
      {
        "name": "foo",
        "value": "bar",
        "state": "unchanged"
      },
      {
        "name": "nest",
        "value": "str",
        "oldValue": {
          "key": "value"
        },
        "state": "updated"
      }
    ],
    "state": "hadChildren"
  },
  {
    "name": "group2",
    "value": {
      "abc": 12345,
      "deep": {
        "id": 45
      }
    },
    "state": "removed"
  },
  {
    "name": "group3",
    "value": {
      "deep": {
        "id": {
          "number": 45
        }
      },
      "fee": 100500
    },
    "state": "added"
  }
]`;

// const filepathExceptions1 = getFixturePath('fileWithExceptions1.json');
// const filepathExceptions2 = getFixturePath('fileWithExceptions2.json');
/* const resultWithExceptions = `{
  - follow: false
  + follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
    timeout:
  + verbose: true
}`; */

test('Main stylish work', () => {
  expect(genDiff(filepathJSON1, filepathJSON2)).toEqual(stylishRightDiff);
  expect(genDiff(filepathYML1, filepathYML2)).toEqual(stylishRightDiff);
// expect(genDiff(filepathExceptions1, filepathExceptions2)).toEqual(resultWithExceptions);
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
