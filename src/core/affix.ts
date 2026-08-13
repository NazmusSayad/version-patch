export type AffixOptions = {
  prefix?: string
  suffix?: string
  optionalPrefix?: string
  optionalSuffix?: string
}

export function stripAffixes(input: string, options: AffixOptions) {
  if (options.prefix !== undefined && options.optionalPrefix !== undefined) {
    throw new Error('Use either --prefix or --optional-prefix, not both')
  }

  if (options.suffix !== undefined && options.optionalSuffix !== undefined) {
    throw new Error('Use either --suffix or --optional-suffix, not both')
  }

  let version = input

  if (options.prefix !== undefined) {
    if (!version.startsWith(options.prefix)) {
      throw new Error(
        `Version "${input}" does not start with the prefix "${options.prefix}"`
      )
    }

    version = version.slice(options.prefix.length)
  } else if (options.optionalPrefix !== undefined) {
    if (version.startsWith(options.optionalPrefix)) {
      version = version.slice(options.optionalPrefix.length)
    }
  }

  if (options.suffix !== undefined) {
    if (!version.endsWith(options.suffix)) {
      throw new Error(
        `Version "${input}" does not end with the suffix "${options.suffix}"`
      )
    }

    version = version.slice(0, version.length - options.suffix.length)
  } else if (options.optionalSuffix !== undefined) {
    if (version.endsWith(options.optionalSuffix)) {
      version = version.slice(0, version.length - options.optionalSuffix.length)
    }
  }

  return version
}
