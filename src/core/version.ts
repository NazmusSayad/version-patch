import { stripAffixes, type AffixOptions } from '@/core/affix.js'
import { validateFormat, type VersionFormat } from '@/core/format.js'
import { applyTransform } from '@/core/transform.js'

export type VersionOptions = AffixOptions & {
  format: VersionFormat
  transform?: string
}

export async function resolveVersion(input: string, options: VersionOptions) {
  let version = input

  if (options.transform !== undefined) {
    if (
      options.prefix !== undefined ||
      options.suffix !== undefined ||
      options.optionalPrefix !== undefined ||
      options.optionalSuffix !== undefined
    ) {
      throw new Error(
        'Use either --transform or --prefix/--suffix/--optional-prefix/--optional-suffix, not both'
      )
    }

    version = await applyTransform(version, options.transform)
  } else {
    version = stripAffixes(version, options)
  }

  validateFormat(version, options.format)

  return version
}
