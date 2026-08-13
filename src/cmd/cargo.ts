import { withVersionOptions } from '@/core/options.js'
import { resolveVersion } from '@/core/version.js'
import { setLockPackageVersion, setPackageVersion } from '@/lib/toml.js'
import { Command } from '@commander-js/extra-typings'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export const cargoCommand = withVersionOptions(
  new Command('cargo')
    .description('patch the version of a cargo package')
    .argument('<version>', 'version to write')
    .option('--manifest-file <path>', 'path to Cargo.toml', './Cargo.toml')
    .option('--lock-file <path>', 'path to Cargo.lock to patch as well')
).action(async (input, options) => {
  const version = await resolveVersion(input, options)
  const manifestFile = resolve(options.manifestFile)
  const manifest = setPackageVersion(
    await readFile(manifestFile, 'utf8'),
    version
  )

  if (options.lockFile === undefined) {
    await writeFile(manifestFile, manifest.text)
    console.log(`${manifestFile}: ${manifest.current} -> ${version}`)
  } else {
    const lockFile = resolve(options.lockFile)
    const lock = setLockPackageVersion(
      await readFile(lockFile, 'utf8'),
      manifest.name,
      version
    )

    await writeFile(manifestFile, manifest.text)
    await writeFile(lockFile, lock.text)
    console.log(`${manifestFile}: ${manifest.current} -> ${version}`)
    console.log(`${lockFile}: ${lock.current} -> ${version}`)
  }
})
