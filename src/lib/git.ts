import { simpleGit } from 'simple-git'

export type GitOptions = {
  push?: true
  gitName?: string
  gitEmail?: string
  gitMsg: string
}

export async function pushChanges(
  files: string[],
  version: string,
  options: GitOptions
) {
  if (options.push === undefined) return

  const config: string[] = []

  if (options.gitName !== undefined) {
    config.push(`user.name=${options.gitName}`)
  }

  if (options.gitEmail !== undefined) {
    config.push(`user.email=${options.gitEmail}`)
  }

  const message = options.gitMsg.replaceAll('{VERSION}', version)
  const git = simpleGit({ config })

  await git.add(files)
  await git.commit(message, files)
  await git.push()

  console.log(`pushed ${files.length} file(s) as "${message}"`)
}
