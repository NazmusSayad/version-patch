import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export async function applyTransform(version: string, path: string) {
  const module = await import(pathToFileURL(resolve(path)).href)
  const transform = module.default

  if (typeof transform !== 'function') {
    throw new Error(
      `Transform "${path}" does not have a default exported function`
    )
  }

  const transformed = await transform(version)

  if (typeof transformed !== 'string') {
    throw new Error(
      `Transform "${path}" returned ${typeof transformed}, expected a string`
    )
  }

  return transformed
}
