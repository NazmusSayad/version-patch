import { defineConfig } from 'tsdown'
import packageJSON from './package.json' with { type: 'json' }

export default defineConfig({
  entry: './src/index.ts',

  clean: true,
  outDir: './dist',
  tsconfig: './tsconfig.json',

  dts: false,
  sourcemap: false,

  format: 'es',
  target: 'ES6',
  minify: 'dce-only',

  deps: {
    neverBundle: [
      /node:/gim,
      ...getExternal((packageJSON as any).peerDependencies),
    ],
  },
})

function getExternal(dependencies: unknown) {
  return Object.keys((dependencies ?? {}) as Record<string, string>).map(
    (dep) => new RegExp(`(^${dep}$)|(^${dep}/)`)
  )
}
