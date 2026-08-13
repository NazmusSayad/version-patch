import { stripAffixes, type AffixOptions } from '@/core/affix.js'
import { validateFormat, type VersionFormat } from '@/core/format.js'
import { applyTransform } from '@/core/transform.js'

export type VersionOptions = AffixOptions & {
  format: VersionFormat
  transform?: string
}

export async function resolveVersion(input: string, options: VersionOptions) {
  let version = stripAffixes(input, options)

  if (options.transform !== undefined) {
    version = await applyTransform(version, options.transform)
  }

  validateFormat(version, options.format)

  return version
}
