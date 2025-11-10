import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import type { Argv } from 'yargs';

export const cli = (name: string, description: string): Argv => {
  return yargs(hideBin(process.argv))
    .scriptName(`playgrounds.github-actions:${name}`)
    .help('help')
    .alias('help', 'h')
    .strict()
    .fail((message, error) => {
      if (error) throw error;

      console.error(`\n❌ ${message}\n`);

      process.exit(1);
    })
    .epilogue(description);
};
