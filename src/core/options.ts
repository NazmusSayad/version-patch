import { VERSION_FORMATS } from '@/core/format.js'
import {
  Option,
  type Command,
  type OptionValues,
} from '@commander-js/extra-typings'

export function withVersionOptions<
  Args extends unknown[],
  Opts extends OptionValues,
>(command: Command<Args, Opts>) {
  return command
    .addOption(
      new Option('--format <format>', 'expected format of the final version')
        .choices(VERSION_FORMATS)
        .default('semver' as const)
    )
    .option('--prefix <prefix>', 'prefix that must be removed from the input')
    .option('--suffix <suffix>', 'suffix that must be removed from the input')
    .option(
      '--optional-prefix <prefix>',
      'prefix that is removed from the input when present'
    )
    .option(
      '--optional-suffix <suffix>',
      'suffix that is removed from the input when present'
    )
    .option(
      '--transform <path>',
      'module default exporting (version: string) => string'
    )
}
