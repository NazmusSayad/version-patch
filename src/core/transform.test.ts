import { applyTransform } from '@/core/transform.js'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let dir: string

beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'version-patch-transform-'))

  await writeFile(
    join(dir, 'dots.mjs'),
    "export default (input) => input.replaceAll('_', '.')\n"
  )
  await writeFile(
    join(dir, 'async.mjs'),
    'export default async (input) => `${input}-beta`\n'
  )
  await writeFile(join(dir, 'number.mjs'), 'export default () => 42\n')
  await writeFile(
    join(dir, 'no-default.mjs'),
    'export const transform = (input) => input\n'
  )
})

afterAll(async () => {
  await rm(dir, { recursive: true })
})

describe('applyTransform', () => {
  it('applies a synchronous transform', async () => {
    await expect(applyTransform('1_2_3', join(dir, 'dots.mjs'))).resolves.toBe(
      '1.2.3'
    )
  })

  it('awaits an asynchronous transform', async () => {
    await expect(applyTransform('1.2.3', join(dir, 'async.mjs'))).resolves.toBe(
      '1.2.3-beta'
    )
  })

  it('throws when the module has no default function', async () => {
    await expect(
      applyTransform('1.2.3', join(dir, 'no-default.mjs'))
    ).rejects.toThrow('does not have a default exported function')
  })

  it('throws when the transform does not return a string', async () => {
    await expect(
      applyTransform('1.2.3', join(dir, 'number.mjs'))
    ).rejects.toThrow('returned number, expected a string')
  })

  it('throws when the module does not exist', async () => {
    await expect(
      applyTransform('1.2.3', join(dir, 'missing.mjs'))
    ).rejects.toThrow(/Cannot find module/)
  })
})
