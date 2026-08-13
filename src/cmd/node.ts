import { withVersionOptions } from '@/core/options.js'
import { resolveVersion } from '@/core/version.js'
import { setJsonVersion } from '@/lib/json.js'
import { Command } from '@commander-js/extra-typings'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export const nodeCommand = withVersionOptions(
  new Command('node')
    .description('patch the version of a node package')
    .argument('<version>', 'version to write')
    .option('--pkg-file <path>', 'path to package.json', './package.json')
).action(async (input, options) => {
  const version = await resolveVersion(input, options)
  const pkgFile = resolve(options.pkgFile)
  const pkg = setJsonVersion(await readFile(pkgFile, 'utf8'), version)

  await writeFile(pkgFile, pkg.text)
  console.log(`${pkgFile}: ${pkg.current} -> ${version}`)
})
