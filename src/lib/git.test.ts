import { pushChanges } from '@/lib/git.js'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { simpleGit } from 'simple-git'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

let dir: string
let work: string
let cwd: string

beforeEach(async () => {
  cwd = process.cwd()
  dir = await mkdtemp(join(tmpdir(), 'version-patch-git-'))
  work = join(dir, 'work')

  await simpleGit().init(true, [join(dir, 'origin.git')])
  await simpleGit(dir).clone(join(dir, 'origin.git'), work)

  const git = simpleGit(work)
  await git.addConfig('user.name', 'Fixture')
  await git.addConfig('user.email', 'fixture@example.com')

  await writeFile(join(work, 'package.json'), '{ "version": "0.1.0" }\n')
  await writeFile(join(work, 'other.txt'), 'untouched\n')
  await git.add('.')
  await git.commit('init')
  await git.raw('branch', '-M', 'main')
  await git.push(['-u', 'origin', 'main'])

  process.chdir(work)
})

afterEach(async () => {
  process.chdir(cwd)
  await rm(dir, { recursive: true, force: true })
})

describe('pushChanges', () => {
  it('commits and pushes the given files', async () => {
    await writeFile(join(work, 'package.json'), '{ "version": "1.0.0" }\n')
    await pushChanges([join(work, 'package.json')], '1.0.0', {
      gitMsg: 'chore(release): {VERSION}',
    })

    const log = await simpleGit(work).log()
    expect(log.latest?.message).toBe('chore(release): 1.0.0')

    const remote = await simpleGit(join(dir, 'origin.git')).log()
    expect(remote.latest?.hash).toBe(log.latest?.hash)
  })

  it('commits only the given files', async () => {
    await writeFile(join(work, 'package.json'), '{ "version": "1.0.0" }\n')
    await writeFile(join(work, 'other.txt'), 'changed\n')
    await pushChanges([join(work, 'package.json')], '1.0.0', {
      gitMsg: 'chore(release): {VERSION}',
    })

    const status = await simpleGit(work).status()
    expect(status.modified).toEqual(['other.txt'])
  })

  it('replaces every {VERSION} placeholder', async () => {
    await writeFile(join(work, 'package.json'), '{ "version": "2.0.0" }\n')
    await pushChanges([join(work, 'package.json')], '2.0.0', {
      gitMsg: 'v{VERSION}: bump to {VERSION}',
    })

    const log = await simpleGit(work).log()
    expect(log.latest?.message).toBe('v2.0.0: bump to 2.0.0')
  })

  it('keeps a message without a placeholder as is', async () => {
    await writeFile(join(work, 'package.json'), '{ "version": "2.0.0" }\n')
    await pushChanges([join(work, 'package.json')], '2.0.0', {
      gitMsg: 'chore: bump',
    })

    const log = await simpleGit(work).log()
    expect(log.latest?.message).toBe('chore: bump')
  })

  it('uses the given name and email without changing the repo config', async () => {
    await writeFile(join(work, 'package.json'), '{ "version": "3.0.0" }\n')
    await pushChanges([join(work, 'package.json')], '3.0.0', {
      gitName: 'CI Bot',
      gitEmail: 'ci@example.com',
      gitMsg: 'chore(release): {VERSION}',
    })

    const git = simpleGit(work)
    const author = await git.raw('log', '-1', '--format=%an <%ae>')
    expect(author.trim()).toBe('CI Bot <ci@example.com>')

    const config = await git.getConfig('user.name')
    expect(config.value).toBe('Fixture')
  })
})
