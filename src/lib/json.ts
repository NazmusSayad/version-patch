import { jsoncPatch } from 'jsonc-patch'

export function setJsonVersion(text: string, version: string) {
  const data = JSON.parse(text)

  if (typeof data.version !== 'string') {
    throw new Error('No version string found in the JSON file')
  }

  return {
    current: data.version,
    text: jsoncPatch(text, { ...data, version }),
  }
}
