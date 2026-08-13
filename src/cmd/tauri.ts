import { withVersionOptions } from '@/core/options.js'
import { resolveVersion } from '@/core/version.js'
import { setJsonVersion } from '@/lib/json.js'
import { setLockPackageVersion, setPackageVersion } from '@/lib/toml.js'
import { Command } from '@commander-js/extra-typings'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export const tauriCommand = withVersionOptions(
  new Command('tauri')
    .description('patch the version of a tauri app')
    .argument('<version>', 'version to write')
    .option('--pkg-file <path>', 'path to package.json', './package.json')
    .option(
      '--conf-file <path>',
      'path to tauri.conf.json',
      './src-tauri/tauri.conf.json'
    )
    .option(
      '--manifest-file <path>',
      'path to Cargo.toml',
      './src-tauri/Cargo.toml'
    )
    .option(
      '--lock-file <path>',
      'path to Cargo.lock',
      './src-tauri/Cargo.lock'
    )
).action(async (input, options) => {
  const version = await resolveVersion(input, options)

  const pkgFile = resolve(options.pkgFile)
  const confFile = resolve(options.confFile)
  const manifestFile = resolve(options.manifestFile)
  const lockFile = resolve(options.lockFile)

  const pkg = setJsonVersion(await readFile(pkgFile, 'utf8'), version)
  const conf = setJsonVersion(await readFile(confFile, 'utf8'), version)
  const manifest = setPackageVersion(
    await readFile(manifestFile, 'utf8'),
    version
  )
  const lock = setLockPackageVersion(
    await readFile(lockFile, 'utf8'),
    manifest.name,
    version
  )

  await writeFile(pkgFile, pkg.text)
  await writeFile(confFile, conf.text)
  await writeFile(manifestFile, manifest.text)
  await writeFile(lockFile, lock.text)

  console.log(`${pkgFile}: ${pkg.current} -> ${version}`)
  console.log(`${confFile}: ${conf.current} -> ${version}`)
  console.log(`${manifestFile}: ${manifest.current} -> ${version}`)
  console.log(`${lockFile}: ${lock.current} -> ${version}`)
})
