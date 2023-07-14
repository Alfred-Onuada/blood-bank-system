import { readdirSync, readFileSync } from 'fs';

/**
 * Reads the environment variables and appends them to the process.env
 */
const parse = function () {
  const filesInCurrDir = readdirSync('.');

  const envFileToUse = filesInCurrDir.find(file => /\.env$/.test(file));

  if (envFileToUse === undefined) {
    throw Error("Couldn't find an env file to use");
  }

  const variables = {};

  const fileContents = readFileSync(`./${envFileToUse}`, 'utf-8');
  const lines = fileContents.split('\n');

  for (const line of lines) {
    const [k, v] = line.split('=');

    if (k && v) {
      variables[k.trim()] = v.trim();
    }
  }

  // add env to the process
  process.env = {
    ...process.env,
    ...variables
  }
}

export default parse;