import { withVersionOptions } from '@/core/options.js'
import { resolveVersion } from '@/core/version.js'
import { Command } from '@commander-js/extra-typings'
import { jsoncPatch } from 'jsonc-patch'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export const nodeCommand = withVersionOptions(
  new Command('node')
    .description('patch the version of a node package')
    .argument('<version>', 'version to write')
    .option('--pkg-file <path>', 'path to package.json', './package.json')
).action(async (input, options) => {
  const version = await resolveVersion(input, options)
  const file = resolve(options.pkgFile)
  const text = await readFile(file, 'utf8')
  const pkg = JSON.parse(text)

  await writeFile(file, jsoncPatch(text, { ...pkg, version }))
  console.log(`${file}: ${pkg.version} -> ${version}`)
})
