import { VERSION_FORMATS } from '@/core/format.js'
import {
  Option,
  type Command,
  type OptionValues,
} from '@commander-js/extra-typings'

export function withCommonOptions<
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
    .option('--git-stage', 'stage the patched files')
    .option('--git-commit', 'stage and commit the patched files')
    .option('--git-push', 'stage, commit and push the patched files')
    .option('--git-name <name>', 'user.name used for the commit')
    .option('--git-email <email>', 'user.email used for the commit')
    .option(
      '--git-msg <message>',
      'commit message, {VERSION} is replaced with the new version',
      'chore(release): {VERSION}'
    )
    .hook('preAction', (command) => {
      const gitStage = command.getOptionValue('gitStage')
      const gitCommit = command.getOptionValue('gitCommit')
      const gitPush = command.getOptionValue('gitPush')
      const gitName = command.getOptionValue('gitName')
      const gitEmail = command.getOptionValue('gitEmail')
      const gitMsg = command.getOptionValueSource('gitMsg')

      if (
        [gitStage, gitCommit, gitPush].filter((value) => value !== undefined)
          .length > 1
      ) {
        throw new Error(
          'Use only one of --git-stage, --git-commit or --git-push'
        )
      }

      if (
        gitCommit === undefined &&
        gitPush === undefined &&
        (gitName !== undefined || gitEmail !== undefined || gitMsg === 'cli')
      ) {
        throw new Error(
          '--git-name, --git-email and --git-msg require --git-commit or --git-push'
        )
      }
    })
}
