#!/usr/bin/env node
import { Command } from 'commander/esm.mjs';
import genDiff from '../index.js';
// import stylish from '../src/formatters.js';

const program = new Command();

const format = (type) => type;

program
  .version('0.1.0', '-V, --version', 'output the version number')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', format, 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2, options) => {
    const diff = genDiff(filepath1, filepath2, options.format);
    console.log(diff);
    return diff;
  });

program.parse(process.argv);

// const options = program.opts();
