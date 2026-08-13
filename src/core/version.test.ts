import { resolveVersion } from '@/core/version.js'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

let transform: string

beforeAll(async () => {
  const dir = await mkdtemp(join(tmpdir(), 'version-patch-version-'))
  transform = join(dir, 'dots.mjs')

  await writeFile(
    transform,
    "export default (input) => input.replaceAll('_', '.')\n"
  )
})

afterAll(async () => {
  await rm(join(transform, '..'), { recursive: true })
})

describe('resolveVersion', () => {
  it('validates a plain version', async () => {
    await expect(resolveVersion('1.2.3', { format: 'semver' })).resolves.toBe(
      '1.2.3'
    )
  })

  it('strips affixes before validating', async () => {
    await expect(
      resolveVersion('v1.2.3-rc', {
        format: 'semver',
        prefix: 'v',
        suffix: '-rc',
      })
    ).resolves.toBe('1.2.3')
  })

  it('applies the transform before validating', async () => {
    await expect(
      resolveVersion('1_2_3', { format: 'semver', transform })
    ).resolves.toBe('1.2.3')
  })

  it('validates against the chosen format', async () => {
    await expect(resolveVersion('2026.08', { format: 'calver' })).resolves.toBe(
      '2026.08'
    )
    await expect(resolveVersion('42', { format: 'number' })).resolves.toBe('42')
  })

  it('throws when the resolved version does not match the format', async () => {
    await expect(
      resolveVersion('v1.2', { format: 'semver', prefix: 'v' })
    ).rejects.toThrow('Version "1.2" is not a valid semver version')
  })
})

describe('transform exclusivity', () => {
  it.each([
    { prefix: 'v' },
    { suffix: '-rc' },
    { optionalPrefix: 'v' },
    { optionalSuffix: '-rc' },
  ])('throws when combined with %o', async (affix) => {
    await expect(
      resolveVersion('1_2_3', { format: 'semver', transform, ...affix })
    ).rejects.toThrow(
      'Use either --transform or --prefix/--suffix/--optional-prefix/--optional-suffix, not both'
    )
  })

  it('does not run the transform when an affix is present', async () => {
    await expect(
      resolveVersion('1_2_3', {
        format: 'semver',
        transform: 'missing.mjs',
        prefix: 'v',
      })
    ).rejects.toThrow('Use either --transform')
  })
})
