import { stripAffixes } from '@/core/affix.js'
import { describe, expect, it } from 'vitest'

describe('prefix', () => {
  it('removes a matching prefix', () => {
    expect(stripAffixes('v1.2.3', { prefix: 'v' })).toBe('1.2.3')
  })

  it('throws when the prefix is missing', () => {
    expect(() => stripAffixes('1.2.3', { prefix: 'v' })).toThrow(
      'Version "1.2.3" does not start with the prefix "v"'
    )
  })

  it('removes a multi character prefix', () => {
    expect(stripAffixes('release-1.2.3', { prefix: 'release-' })).toBe('1.2.3')
  })
})

describe('suffix', () => {
  it('removes a matching suffix', () => {
    expect(stripAffixes('1.2.3-rc', { suffix: '-rc' })).toBe('1.2.3')
  })

  it('throws when the suffix is missing', () => {
    expect(() => stripAffixes('1.2.3', { suffix: '-rc' })).toThrow(
      'Version "1.2.3" does not end with the suffix "-rc"'
    )
  })
})

describe('optional prefix', () => {
  it('removes the prefix when present', () => {
    expect(stripAffixes('v1.2.3', { optionalPrefix: 'v' })).toBe('1.2.3')
  })

  it('keeps the version when the prefix is absent', () => {
    expect(stripAffixes('1.2.3', { optionalPrefix: 'v' })).toBe('1.2.3')
  })
})

describe('optional suffix', () => {
  it('removes the suffix when present', () => {
    expect(stripAffixes('1.2.3-rc', { optionalSuffix: '-rc' })).toBe('1.2.3')
  })

  it('keeps the version when the suffix is absent', () => {
    expect(stripAffixes('1.2.3', { optionalSuffix: '-rc' })).toBe('1.2.3')
  })
})

describe('combinations', () => {
  it('removes the prefix before the suffix', () => {
    expect(stripAffixes('v1.2.3-rc', { prefix: 'v', suffix: '-rc' })).toBe(
      '1.2.3'
    )
  })

  it('mixes a required prefix with an optional suffix', () => {
    expect(stripAffixes('v1.2.3', { prefix: 'v', optionalSuffix: '-rc' })).toBe(
      '1.2.3'
    )
  })

  it('returns the input when no affix is given', () => {
    expect(stripAffixes('1.2.3', {})).toBe('1.2.3')
  })

  it('throws when both prefix kinds are given', () => {
    expect(() =>
      stripAffixes('v1.2.3', { prefix: 'v', optionalPrefix: 'v' })
    ).toThrow('Use either --prefix or --optional-prefix, not both')
  })

  it('throws when both suffix kinds are given', () => {
    expect(() =>
      stripAffixes('1.2.3-rc', { suffix: '-rc', optionalSuffix: '-rc' })
    ).toThrow('Use either --suffix or --optional-suffix, not both')
  })
})

describe('edge cases', () => {
  it('keeps the version when the affixes are empty strings', () => {
    expect(stripAffixes('1.2.3', { prefix: '', suffix: '' })).toBe('1.2.3')
  })

  it('removes only the first occurrence of the prefix', () => {
    expect(stripAffixes('vv1.2.3', { prefix: 'v' })).toBe('v1.2.3')
  })

  it('reports the original input in the suffix error', () => {
    expect(() =>
      stripAffixes('v1.2.3', { prefix: 'v', suffix: '-rc' })
    ).toThrow('Version "v1.2.3" does not end with the suffix "-rc"')
  })
})
