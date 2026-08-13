import { withCommonOptions } from '@/core/options.js'
import { resolveVersion } from '@/core/version.js'
import { pushChanges } from '@/lib/git.js'
import { setJsonVersion } from '@/lib/json.js'
import { setLockPackageVersion, setPackageVersion } from '@/lib/toml.js'
import { Command } from '@commander-js/extra-typings'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export const tauriCommand = withCommonOptions(
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
    .option('--skip-pkg', 'do not patch package.json')
    .option('--skip-conf', 'do not patch tauri.conf.json')
    .option('--skip-manifest', 'do not patch Cargo.toml')
    .option('--skip-lock', 'do not patch Cargo.lock')
).action(async (input, options) => {
  if (
    options.skipPkg &&
    options.skipConf &&
    options.skipManifest &&
    options.skipLock
  ) {
    throw new Error('Nothing to patch, every file is skipped')
  }

  const version = await resolveVersion(input, options)

  const pkgFile = resolve(options.pkgFile)
  const confFile = resolve(options.confFile)
  const manifestFile = resolve(options.manifestFile)
  const lockFile = resolve(options.lockFile)

  let pkg: ReturnType<typeof setJsonVersion> | undefined
  let conf: ReturnType<typeof setJsonVersion> | undefined
  let manifest: ReturnType<typeof setPackageVersion> | undefined
  let lock: ReturnType<typeof setLockPackageVersion> | undefined

  if (!options.skipPkg) {
    pkg = setJsonVersion(await readFile(pkgFile, 'utf8'), version)
  }

  if (!options.skipConf) {
    conf = setJsonVersion(await readFile(confFile, 'utf8'), version)
  }

  if (!options.skipManifest || !options.skipLock) {
    manifest = setPackageVersion(await readFile(manifestFile, 'utf8'), version)

    if (!options.skipLock) {
      lock = setLockPackageVersion(
        await readFile(lockFile, 'utf8'),
        manifest.name,
        version
      )
    }
  }

  const patched: string[] = []

  if (pkg !== undefined) {
    await writeFile(pkgFile, pkg.text)
    console.log(`${pkgFile}: ${pkg.current} -> ${version}`)
    patched.push(pkgFile)
  }

  if (conf !== undefined) {
    await writeFile(confFile, conf.text)
    console.log(`${confFile}: ${conf.current} -> ${version}`)
    patched.push(confFile)
  }

  if (manifest !== undefined && !options.skipManifest) {
    await writeFile(manifestFile, manifest.text)
    console.log(`${manifestFile}: ${manifest.current} -> ${version}`)
    patched.push(manifestFile)
  }

  if (lock !== undefined) {
    await writeFile(lockFile, lock.text)
    console.log(`${lockFile}: ${lock.current} -> ${version}`)
    patched.push(lockFile)
  }

  await pushChanges(patched, version, options)
})
