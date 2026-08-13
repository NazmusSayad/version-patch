import { Command } from '@commander-js/extra-typings'

export const nodeCommand = new Command('node')
  .description('patch the version of a node package')
  .argument('<version>', 'version to patch to')
  .option(
    '-c, --cwd <path>',
    'directory containing package.json',
    process.cwd()
  )
  .option('-d, --dry-run', 'print the result instead of writing it')
  .action(async (version, options) => {
    console.log(version, options)
  })
