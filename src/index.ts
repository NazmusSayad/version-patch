#!/usr/bin/env node

import { cargoCommand } from '@/cmd/cargo.js'
import { nodeCommand } from '@/cmd/node.js'
import { tauriCommand } from '@/cmd/tauri.js'
import { Command } from '@commander-js/extra-typings'
import { readFileSync } from 'node:fs'

const packageJSON = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8')
)

new Command()
  .name(packageJSON.name)
  .description(packageJSON.description ?? '')
  .version(packageJSON.version, '-v, --version')
  .addCommand(nodeCommand)
  .addCommand(cargoCommand)
  .addCommand(tauriCommand)
  .parseAsync()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
