import { simpleGit } from 'simple-git'

export type GitOptions = {
  gitStage?: true
  gitCommit?: true
  gitPush?: true
  gitName?: string
  gitEmail?: string
  gitMsg: string
}

export async function runGitActions(
  files: string[],
  version: string,
  options: GitOptions
) {
  if (
    options.gitStage === undefined &&
    options.gitCommit === undefined &&
    options.gitPush === undefined
  ) {
    return
  }

  const config: string[] = []

  if (options.gitName !== undefined) {
    config.push(`user.name=${options.gitName}`)
  }

  if (options.gitEmail !== undefined) {
    config.push(`user.email=${options.gitEmail}`)
  }

  const message = options.gitMsg.replaceAll('{VERSION}', version)
  const git = simpleGit({ config })

  if (options.gitStage !== undefined) {
    await git.add(files)
    console.log(`staged ${files.length} file(s)`)
  } else if (options.gitCommit !== undefined) {
    await git.add(files)
    await git.commit(message, files)
    console.log(`committed ${files.length} file(s) as "${message}"`)
  } else if (options.gitPush !== undefined) {
    await git.add(files)
    await git.commit(message, files)
    await git.push()
    console.log(`pushed ${files.length} file(s) as "${message}"`)
  } else {
    throw new Error('No git action requested')
  }
}
