import { setJsonVersion } from '@/lib/json.js'
import { describe, expect, it } from 'vitest'

describe('setJsonVersion', () => {
  it('returns the current version', () => {
    const result = setJsonVersion('{ "version": "0.1.0" }', '1.0.0')

    expect(result.current).toBe('0.1.0')
  })

  it('replaces the version', () => {
    const result = setJsonVersion('{ "version": "0.1.0" }', '1.0.0')

    expect(JSON.parse(result.text).version).toBe('1.0.0')
  })

  it('preserves indentation, key order and surrounding keys', () => {
    const text = [
      '{',
      '  "name": "demo",',
      '  "version": "0.1.0",',
      '  "scripts": {',
      '    "dev": "vite"',
      '  }',
      '}',
      '',
    ].join('\n')

    expect(setJsonVersion(text, '2.0.0').text).toBe(
      text.replace('0.1.0', '2.0.0')
    )
  })

  it('only touches the top level version', () => {
    const text = '{ "version": "0.1.0", "deps": { "version": "0.1.0" } }'
    const result = setJsonVersion(text, '9.9.9')

    expect(JSON.parse(result.text)).toEqual({
      version: '9.9.9',
      deps: { version: '0.1.0' },
    })
  })

  it('throws when there is no version key', () => {
    expect(() => setJsonVersion('{ "name": "demo" }', '1.0.0')).toThrow(
      'No version string found in the JSON file'
    )
  })

  it('throws when the version is not a string', () => {
    expect(() => setJsonVersion('{ "version": 1 }', '1.0.0')).toThrow(
      'No version string found in the JSON file'
    )
  })

  it('throws on invalid JSON', () => {
    expect(() => setJsonVersion('{ "version": }', '1.0.0')).toThrow()
  })
})
