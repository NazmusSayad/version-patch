const SEMVER =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
const CALVER =
  /^\d{4}\.(0[1-9]|1[0-2]|[1-9])(\.\d+)?(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$/
const NUMBER = /^\d+$/

export const VERSION_FORMATS = ['semver', 'calver', 'number'] as const

export type VersionFormat = (typeof VERSION_FORMATS)[number]

export function validateFormat(version: string, format: VersionFormat) {
  if (format === 'semver') {
    if (!SEMVER.test(version)) {
      throw new Error(`Version "${version}" is not a valid semver version`)
    }
  } else if (format === 'calver') {
    if (!CALVER.test(version)) {
      throw new Error(`Version "${version}" is not a valid calver version`)
    }
  } else if (format === 'number') {
    if (!NUMBER.test(version)) {
      throw new Error(`Version "${version}" is not a valid number version`)
    }
  } else {
    throw new Error(`Unknown format "${format}"`)
  }
}
