#!/usr/bin/env node

import { nodeCommand } from '@/cmd/node.js'
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
  .parseAsync()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
