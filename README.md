# version-patch

One CLI to patch the version of any project. Every platform gets its own
command, and they all share the same version pipeline and git options.

```bash
npx version-patch node 1.2.3
```

## Platforms

| Command | Patches                                                       |
| ------- | ------------------------------------------------------------- |
| `node`  | `package.json`                                                |
| `cargo` | `Cargo.toml`, `Cargo.lock`                                    |
| `tauri` | `package.json`, `tauri.conf.json`, `Cargo.toml`, `Cargo.lock` |

More platforms are on the way. Files are edited in place, so formatting and
comments stay exactly as they were.

## Version pipeline

```
input -> remove prefix/suffix (or transform) -> validate format
```

```bash
npx version-patch node v1.2.3-rc --prefix v --suffix -rc
```

| Option                       | Description                                            |
| ---------------------------- | ------------------------------------------------------ |
| `--format <format>`          | `semver` (default), `calver` or `number`               |
| `--prefix <prefix>`          | must be present, removed from the input                |
| `--suffix <suffix>`          | must be present, removed from the input                |
| `--optional-prefix <prefix>` | removed only when present                              |
| `--optional-suffix <suffix>` | removed only when present                              |
| `--transform <path>`         | module default exporting `(version: string) => string` |

`--transform` replaces the prefix/suffix options, they cannot be used together.

## Git

```bash
npx version-patch node 1.2.3 --git-push --git-msg "release v{VERSION}"
```

| Option               | Description                                                            |
| -------------------- | ---------------------------------------------------------------------- |
| `--git-stage`        | stage the patched files                                                |
| `--git-commit`       | stage and commit them                                                  |
| `--git-push`         | stage, commit and push them                                            |
| `--git-name <name>`  | `user.name` for the commit                                             |
| `--git-email <mail>` | `user.email` for the commit                                            |
| `--git-msg <msg>`    | message, `{VERSION}` is replaced (default `chore(release): {VERSION}`) |

Only one of `--git-stage`, `--git-commit` and `--git-push` can be used at a
time, and only the patched files are touched. Use `--git-commit` when you want
to push yourself later, for example after publishing.

```bash
npx version-patch node 1.2.3 --git-commit
npm publish
git push
```

## Files

Each command can point to its own files and skip the ones you do not want.

```bash
npx version-patch cargo 1.2.3 --manifest-file ./crates/app/Cargo.toml --skip-lock
npx version-patch tauri 1.2.3 --skip-pkg --skip-lock
```

Run `npx version-patch <platform> --help` for the full list.
