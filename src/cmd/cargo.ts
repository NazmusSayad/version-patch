import { withCommonOptions } from '@/core/options.js'
import { resolveVersion } from '@/core/version.js'
import { runGitActions } from '@/lib/git.js'
import { setLockPackageVersion, setPackageVersion } from '@/lib/toml.js'
import { Command } from '@commander-js/extra-typings'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export const cargoCommand = withCommonOptions(
  new Command('cargo')
    .description('patch the version of a cargo package')
    .argument('<version>', 'version to write')
    .option('--manifest-file <path>', 'path to Cargo.toml', './Cargo.toml')
    .option('--lock-file <path>', 'path to Cargo.lock', './Cargo.lock')
    .option('--skip-lock', 'do not patch Cargo.lock')
).action(async (input, options) => {
  const version = await resolveVersion(input, options)
  const manifestFile = resolve(options.manifestFile)
  const lockFile = resolve(options.lockFile)
  const manifest = setPackageVersion(
    await readFile(manifestFile, 'utf8'),
    version
  )

  let lock: ReturnType<typeof setLockPackageVersion> | undefined

  if (!options.skipLock) {
    lock = setLockPackageVersion(
      await readFile(lockFile, 'utf8'),
      manifest.name,
      version
    )
  }

  const patched = [manifestFile]

  await writeFile(manifestFile, manifest.text)
  console.log(`${manifestFile}: ${manifest.current} -> ${version}`)

  if (lock !== undefined) {
    await writeFile(lockFile, lock.text)
    console.log(`${lockFile}: ${lock.current} -> ${version}`)
    patched.push(lockFile)
  }

  await runGitActions(patched, version, options)
})
