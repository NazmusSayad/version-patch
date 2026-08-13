import * as toml from '@ltd/j-toml'

export function setPackageVersion(text: string, version: string) {
  const data = toml.parse(text) as {
    package?: { name?: unknown; version?: unknown }
  }

  if (data.package === undefined) {
    throw new Error('No [package] table found in the manifest')
  }

  if (typeof data.package.name !== 'string') {
    throw new Error('No name string found in the [package] table')
  }

  if (typeof data.package.version !== 'string') {
    throw new Error(
      'No version string found in the [package] table, an inherited version cannot be patched'
    )
  }

  const name = data.package.name
  const current = data.package.version
  const tableIndex = text.search(/^[ \t]*\[[ \t]*package[ \t]*\]/m)

  if (tableIndex === -1) {
    throw new Error('Cannot locate the [package] table in the manifest')
  }

  return {
    name,
    current,
    text: replaceVersion(text, tableIndex, current, version),
  }
}

export function setLockPackageVersion(
  text: string,
  name: string,
  version: string
) {
  const data = toml.parse(text) as {
    package?: Array<{ name?: unknown; version?: unknown }>
  }

  if (data.package === undefined) {
    throw new Error('No [[package]] entries found in the lock file')
  }

  const entry = data.package.find((item) => item.name === name)

  if (entry === undefined) {
    throw new Error(`Package "${name}" not found in the lock file`)
  }

  if (typeof entry.version !== 'string') {
    throw new Error(`Package "${name}" has no version string in the lock file`)
  }

  const current = entry.version
  const nameIndex = text.search(
    new RegExp(`^[ \\t]*name[ \\t]*=[ \\t]*(['"])${escapeRegExp(name)}\\1`, 'm')
  )

  if (nameIndex === -1) {
    throw new Error(`Cannot locate name = "${name}" in the lock file`)
  }

  return { current, text: replaceVersion(text, nameIndex, current, version) }
}

function replaceVersion(
  text: string,
  from: number,
  current: string,
  version: string
) {
  const match = text
    .slice(from)
    .match(
      new RegExp(
        `(^[ \\t]*version[ \\t]*=[ \\t]*)(['"])${escapeRegExp(current)}\\2`,
        'm'
      )
    )

  if (match === null || match.index === undefined) {
    throw new Error(`Cannot locate version = "${current}" to replace`)
  }

  const index = from + match.index

  return (
    text.slice(0, index) +
    `${match[1]}${match[2]}${version}${match[2]}` +
    text.slice(index + match[0].length)
  )
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
