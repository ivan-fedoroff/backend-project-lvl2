import * as fs from 'fs';
import path from 'path';

const readFile = (filepath) => {
  const fullPath = path.resolve(filepath);
  const data = fs.readFileSync(fullPath, 'utf-8');
  return data;
};

export default readFile;
