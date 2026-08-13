# version-patch

Set the version of a project from the command line, without reformatting the
files.

```bash
npx version-patch node 1.2.3
npx version-patch cargo 1.2.3      # Cargo.toml, Cargo.lock
npx version-patch tauri 1.2.3      # package.json, tauri.conf.json, Cargo.toml, Cargo.lock
```

## Version

```bash
npx version-patch node v1.2.3-rc --prefix v --suffix -rc
```

- `--format <format>` `semver` (default), `calver` or `number`
- `--prefix <prefix>` `--suffix <suffix>` removed, must be present
- `--optional-prefix <prefix>` `--optional-suffix <suffix>` removed if present
- `--transform <path>` module default exporting `(version: string) => string`,
  cannot be mixed with the prefix/suffix options

## Git

```bash
npx version-patch node 1.2.3 --git-push --git-msg "release v{VERSION}"
```

- `--git-stage` `--git-commit` `--git-push` pick one, only the patched files
- `--git-name <name>` `--git-email <mail>` used for the commit
- `--git-msg <msg>` default `chore(release): {VERSION}`

## Files

```bash
npx version-patch cargo 1.2.3 --manifest-file ./crates/app/Cargo.toml --skip-lock
npx version-patch tauri 1.2.3 --skip-pkg --skip-lock
```

Run `npx version-patch <platform> --help` for the rest.

## Release workflow example

See [our publish workflow](.github/workflows/publish.yml) as an example of a
release pipeline using `version-patch`.
