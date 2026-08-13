import { Command } from '@commander-js/extra-typings'
import { simpleGit } from 'simple-git'

export const gitPushCommand = new Command('git-push')
  .description('commit the given files and push them')
  .argument('<files...>', 'files to commit')
  .option('--name <name>', 'user.name used for the commit')
  .option('--email <email>', 'user.email used for the commit')
  .option('--msg <message>', 'commit message', 'chore: update files')
  .action(async (files, options) => {
    const config: string[] = []

    if (options.name !== undefined) {
      config.push(`user.name=${options.name}`)
    }

    if (options.email !== undefined) {
      config.push(`user.email=${options.email}`)
    }

    const git = simpleGit({ config })

    await git.add(files)
    await git.commit(options.msg, files)
    await git.push()

    console.log(`pushed ${files.length} file(s) as "${options.msg}"`)
  })
