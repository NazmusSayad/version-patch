import { validateFormat, VERSION_FORMATS } from '@/core/format.js'
import { describe, expect, it } from 'vitest'

describe('semver', () => {
  it.each([
    '0.0.0',
    '1.2.3',
    '10.20.30',
    '1.2.3-rc.1',
    '1.2.3-alpha.beta',
    '1.2.3+build.1',
    '1.2.3-rc.1+build.1',
  ])('accepts %s', (version) => {
    expect(() => validateFormat(version, 'semver')).not.toThrow()
  })

  it.each(['1.2', '1', 'v1.2.3', '1.2.3.4', '01.2.3', '1.2.3-', ''])(
    'rejects %s',
    (version) => {
      expect(() => validateFormat(version, 'semver')).toThrow(
        'is not a valid semver version'
      )
    }
  )
})

describe('calver', () => {
  it.each(['2026.8', '2026.08', '2026.08.13', '2026.12.1', '2026.8.13-rc.1'])(
    'accepts %s',
    (version) => {
      expect(() => validateFormat(version, 'calver')).not.toThrow()
    }
  )

  it.each(['2026', '2026.13', '2026.0', '26.08.13', '1.2.3-rc'])(
    'rejects %s',
    (version) => {
      expect(() => validateFormat(version, 'calver')).toThrow(
        'is not a valid calver version'
      )
    }
  )
})

describe('number', () => {
  it.each(['0', '1', '42', '0042'])('accepts %s', (version) => {
    expect(() => validateFormat(version, 'number')).not.toThrow()
  })

  it.each(['1.0', '-1', 'v1', ''])('rejects %s', (version) => {
    expect(() => validateFormat(version, 'number')).toThrow(
      'is not a valid number version'
    )
  })
})

describe('formats', () => {
  it('exposes every supported format', () => {
    expect(VERSION_FORMATS).toEqual(['semver', 'calver', 'number'])
  })

  it('throws on an unknown format', () => {
    expect(() =>
      validateFormat('1.2.3', 'toml' as (typeof VERSION_FORMATS)[number])
    ).toThrow('Unknown format "toml"')
  })
})
