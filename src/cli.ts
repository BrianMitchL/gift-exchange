import { sync } from 'load-json-file';
import { knuthShuffle } from 'knuth-shuffle';
import { validate, print } from './utils';
import { calculate } from './index';
import { Configuration, Exclusion } from './models';

// validate arguments
if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

let prettyPrint = false;
if (process.argv[3] && ['--pretty', '-p'].includes(process.argv[3])) {
  prettyPrint = true;
}

// get config
const config: Configuration = sync(process.argv[2]);
// validate configuration
if (!validate(config)) process.exit(1);

const exclusions: Exclusion[] = config.exclusions || [];
const pairs = calculate(knuthShuffle(config.people), knuthShuffle(exclusions));
print(pairs, prettyPrint);
