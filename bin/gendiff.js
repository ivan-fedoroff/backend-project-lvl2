#!/usr/bin/env node
// index.mjs
import { Command } from 'commander/esm.mjs';

const program = new Command();

program
  .version('0.1.0', '-V, --version', 'output the version number')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format')
  .arguments('[type]');

program.parse(process.argv);

const options = program.opts();
if (options.format) console.log(`- ${options.format}`);
// export default program;
