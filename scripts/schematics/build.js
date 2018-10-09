'use strict';

const cpy = require('cpy');
const execa = require('execa');

const dist = 'dist/schematics';
const pathToCollection = 'schematics/src/collection.json';


build();

async function build() {
  cpy(pathToCollection, dist);
  await execa.shell(`tsc -p schematics/tsconfig.json`);
}