# Agents

## Run and verify

- ESM repo (`"type": "module"`). Launchers: `bun run opencode -- <args>` (e.g. `bun run opencode -- mcp list`), `bun run skill -- <args>`, `bun run bun -- <args>`, `bun run gh -- <args>`, and `bun run git -- <args>`. They run the matching file in `scripts/`; `bun` uses `process.execPath` as the Bun binary, `gh` wraps the GitHub CLI, and `git` wraps git.
- `bun run gh:secrets` imports `.env` into GitHub Actions secrets via `gh secret set -f .env`. `bun run git:push` runs `git push origin HEAD` through `scripts/git.js`, since `gh` has no general push command. For `push`, the launcher injects a `credential.helper` that reads `GITHUB_TOKEN` from `.env`, so HTTPS pushes authenticate without putting the token in the remote URL or process arguments.
- All launchers pass argv through in its original order via `argument.raw`. Do not switch them to `stringify(parse(...))`, which reorders flags before subcommands and breaks CLIs like `skills add`.
- Official GitHub skills come from `github/github-mcp-server` (18 GitHub workflow skills) and `github/awesome-copilot` (the Actions/CI set). They are installed into `.agents/skills/`, with `skills-lock.json` tracking versions. The skills CLI takes repeated `--skill <name>` flags; a comma-separated value is parsed as one name and fails.
- Unit tests live in `test/system/` and use `bun:test`; `bunfig.toml` sets the test root to `./test` and ignores `*.spec.js` patterns, and `bun run bun:test` runs them through `scripts/bun.js`. Verify by invoking the launcher and running the suite.
- Bun (>=1.4.5) is the declared runtime; the code uses standard `node:*` APIs that Bun supports, including `node:util.parseEnv` and top-level await.

## Conventions and commits

- Follow `CONTRIBUTING.md` for formatting, JS structure/JSDoc, Markdown shapes, and commit prefixes.
- Commit changes automatically when a task is done: stage only files you intentionally changed (never `.env`), use the `(new|fix|refactor|chore|ui)` prefix from `CONTRIBUTING.md`, and do not ask for confirmation.

## Environment and config

- `.env` is gitignored and holds quoted project metadata (`NAME`, `VERSION`, `ORGANIZATION`, `PORT`, etc.), `GITHUB_REPOSITORY` (the `origin` remote URL), plus `OPENCODE_API_KEY` and `GITHUB_TOKEN`. Keep secrets there, not in `opencode.json`.
- `scripts/opencode.js` loads `.env` and passes it to the child process. Launch OpenCode through it when the GitHub token matters: a background service started without `GITHUB_TOKEN` reports `github failed: Authorization header is badly formatted` (HTTP 400). Refresh the service with `bun run opencode -- service restart` after token changes.
- `opencode.json` uses the V2 shape `mcp.servers.<name>` (not legacy `mcp.<name>`), `oauth: false` for PAT auth, and `compaction.auto: false`.

## `system/` conventions

- Named ESM exports only, no shebangs. Import Node APIs from `node:*` modules (named bindings from `node:process`), not globals or `process.*`; `signal.js` is the exception because `on`/`off` are not named exports there.
- Wrap the matching Node built-in rather than reimplementing it: `argument.js` delegates to `node:util.parseArgs`, `console.js` to `node:console`, `io.js` to `node:fs`, `path.js` to `node:path`, `process.js` to `node:child_process`, `uri.js` to `URL`, and `date.js` to `Date`.
- `console.js` exports `info`, `warn`, `error`, `debug`, and `trace` (no `console` object, no log levels). `info` prints success/informational messages, `warn` prints warnings, `error` prints errors, `debug(task, ...args)` awaits a sync or async task and prints its result and elapsed time, and `trace()` is a separate wrapper for stack traces. Neither `error` nor `debug` calls `trace` implicitly. Object values are rendered with `util.inspect` at unlimited depth.
- `io.js` wraps `node:fs` and exports only `read(path, encoding?)` and `write(path, data, {append}?)`; failures are wrapped in `IoError`. Filesystem structure lives in `path.js`: `resolve`, `join`, `normalize`, `base`, `extension`, `parent`, `root`, `create`, `remove`, `move`, `list`, and `details`. `inspect` is synchronous, `create` skips existing paths, `details` throws for a missing path, and failures are wrapped in `PathError`.
- `os.js` exports individual `platform()`, `architecture()`, `hostname()`, and `uptime()` functions; there is no `info()` aggregate.
- `argument.js`, `console.js`, `environment.js`, `io.js`, `path.js`, `process.js`, and `uri.js` define private `*Error` factories that return plain object literals with `name`, `message`, and `cause`; other modules do not throw. See `CONTRIBUTING.md` for each module's error contract.
- Utilities return plain objects or strings, never `Date`, `URL`, or stream objects. `date.parse()` exposes `valid`/`iso`/UTC fields; `uri.js` exports `url()`, `encode()`, `decode()`, `encodeUriComponent()`, `decodeUriComponent()`, `fileUrlToPath()`, and `pathToFileUrl()`; conversions use `node:url` and return plain strings, and failures throw `UriError`. Timing lives inside `console.debug`, which uses a private `measure` helper and rethrows task failures.
- `argument.js` re-exports `node:process` `argv` as `argv`; `parse()` wraps `node:util.parseArgs` with a caller-supplied config and returns positionals under `_`, `stringify()` round-trips that shape, and `raw()` preserves original argv order for pass-through launchers.
- `environment.js` re-exports `node:process` `env` as `env` alongside `DEFAULT_PATH`, `parse`, `load`, `optional`, and `required`; `process.js` re-exports `execPath` and wraps `chdir`. Scripts import only from `system/*`, never `node:*` directly.
- `path.base()` strips the extension, `extension()` has no leading dot, and `parent()` is `dirname`; there are no `exists`, `exist`, `isFile`, `isDirectory`, or `sep` exports.
- `process.js` is synchronous: `exec()` returns `{code, stdout, stderr, error}` and `spawn()` returns `{code, signal, stdout, stderr, error}`; neither returns a promise or child handle. Launchers time `spawn()` with `debug()` and call `chdir(root)` on startup so the workspace root is the working directory.
- `signal.on()` resolves to an unsubscribe function; call it when done.

## Repo state

- `main` has only an empty root commit (`.`); application files are untracked. `.gitignore` covers `.env` and `node_modules/`.
