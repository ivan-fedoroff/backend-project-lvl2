#!/usr/bin/env node
// index.mjs
import { Command } from 'commander/esm.mjs';

const program = new Command();

program
  .version('0.1.0', '-V, --version', 'output the version number')
  .description('Compares two configuration files and shows a difference.');

program.parse(process.argv);

// export default program;
