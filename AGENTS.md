# Agent instructions

## Project shape

- This is a configuration-only private ESM package; it has no application source, workspace, or build entrypoint.
- Bun is required (`>=1.4.2`); `package.json` declares support for Linux and macOS only. Use `bun install` and keep `bun.lock` in sync.

## Commands

- `bun run opencode` is the only package script; it runs `bun x --bun opencode`.
- There are no configured test, lint, formatter, typecheck, or build scripts; do not invent commands for them.

## Runtime configuration

- `opencode.json` is the runtime source of truth. It loads this file through `instructions` and selects the `0rchestrator` agent by default.
- The config enables auto-update notifications, snapshots, and automatic compaction with pruning.

## Mandatory obligations

- Follow `CONTRIBUTING.md` for every new or edited file: use 2-space indentation, LF line endings, and a final newline; apply its naming conventions.
- Keep `README.md` accurate for project composition, setup, usage, and system architecture.
- In the README project composition, list directories before files and end directory names with `/`.
- Keep `CHANGELOG.md` synchronized with the initial project files and major changes using the existing HTML table and `yyyy-mm-dd hh:mm:ss UTC±00:00` timestamps.
