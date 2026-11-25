# Contributing

Conventions for files, code, documentation, and commits in this repository. Follow them when editing; they are enforced by review, not by tooling.

## Effort

| Change type | Expected effort |
| --- | --- |
| `(new)` | Investigate existing modules first, implement the full feature, verify it runs |
| `(fix)` | Identify the root cause before editing, verify the fix and nearby behavior |
| `(refactor)` | Preserve observable behavior and verify every touched module |
| `(chore)` | Keep config and docs accurate and parseable |
| `(ui)` | Verify the rendered result |

- Read executable sources (scripts, config, manifests) before changing behavior. Prefer them over prose when the two disagree.
- Apply deeper reasoning to behavior changes and shallower reasoning to mechanical edits.
- Do not stop at a partial fix when the root cause is reachable.

## File format (all files)

| Rule | Value | Notes |
| --- | --- | --- |
| Indentation | 2 spaces | No tabs |
| Trailing whitespace | Trimmed | No spaces or tabs at line ends |
| Final newline | Inserted | Every text file ends with one newline |
| Line endings | LF | No CRLF |

Binary assets are exempt from the text-file rules.

## JSON/TOML

- Always expand `{}` and `[]`, including empty ones: opening and closing tokens go on their own lines.
- Put one value per line.
- Keep `package.json` `scripts` alphabetically ordered so each base command sits with its `:` variants.

```json
{
  "name": "Template",
  "scripts": {
  },
  "items": [
    "a",
    "b"
  ]
}
```

## JavaScript

### Statement order

1. `import` statements
2. variable declaration statements
3. function declaration statements
4. `export {...}` statement
5. `export default` statement

Arrow functions assigned to `const` are declarations, so the function-declaration slot stays empty in this repo.

```js
import { readFile } from "node:fs/promises";

const root = "/path";

/** Reads a file as text. */
const load = async (path) => readFile(path, "utf8");

export {
  load
};
```

### Conventions

| Rule | Convention |
| --- | --- |
| Object/array literals | Expand when they hold 2 or more values, one value per line |
| Trailing commas | Trim them in JS files, including expanded literals, imports, exports, and destructuring |
| Import/export/destructuring | Expand when they name 2 or more bindings |
| JSDoc | Always on public variables and functions, with `@param`/`@returns` where applicable |
| Functions | Arrow functions only; never the `function` keyword |
| Language | Vanilla JavaScript (ESM); no TypeScript files or type annotations |
| Built-ins | Wrap the corresponding Node built-in instead of reimplementing it; `argument.js` delegates to `node:util.parseArgs` and `console.js` to `node:console` |
| Console | `console.js` exports `info`, `warn`, `error`, `debug`, and `trace`; `error` prints errors, `debug(task, ...args)` times a sync or async task and prints its result with time, and object values use `util.inspect` at unlimited depth |

- In `system/*`, import Node builtins from `node:*` modules; prefer named bindings from `node:process` over globals. Scripts import only from `system/*`.
- `system/io.js` uses synchronous `node:fs` calls and exposes no stream helpers; `system/path.js` owns filesystem structure operations.

### Return values

Implementations return only literal data types:

| Type | Example |
| --- | --- |
| Object literal | `{ key: "value" }` |
| Array literal | `["a", "b"]` |
| String literal | `"value"` |
| Number literal | `42` |
| Boolean literal | `true` |
| Function literal | `(value) => value` |

Arrow functions are the only function literal form. Class instances, `Date`, `URL`, and stream objects force callers to know a concrete type and make results harder to log, compare, and serialize, so keep return values to the literal types above.

Thrown values are the exception. A module with a real failure path defines a private `*Error` factory that returns a plain object literal with `name`, `message`, and `cause`, replacing the built-in error. Do not add a factory to a module that cannot throw.

### Error handling

| Module | Failure behavior |
| --- | --- |
| `argument.js` | Throws `ArgumentError` for invalid input |
| `console.js` | Delegates to `node:console`; throws `ConsoleError` with `cause` for a failed built-in call |
| `date.js` | Returns `""` or a `valid: false` object for invalid input |
| `environment.js` | Throws `EnvironmentError` with `cause` |
| `io.js` | Throws `IoError` with `cause` |
| `os.js` | Cannot fail |
| `path.js` | Throws `PathError` for failed filesystem operations and missing paths in `details()` |
| `process.js` | `exec` and `spawn` return an `error` field; invalid commands throw `ProcessError` |
| `signal.js` | Cannot fail for valid signal names |
| `uri.js` | `url()` returns `null` for invalid input |

## Markdown

| Data | Format |
| --- | --- |
| Key-value pairs, layout data | Table |
| Files and directories | Tree-like structure |
| Flow charts and diagrams | Mermaid code block |

Trees use `├──`, `└──`, and `│` prefixes. Diagrams use fenced `mermaid` blocks.

### Documentation

- Explain why a rule or field exists and what breaks when it is ignored, not just what it is.
- Use complete sentences for behavior and rationale; reserve tables for key-value maps and layout data.
- Define terms that are not obvious from a filename before using them.

## Testing

- Unit tests live in `test/system/` and mirror the module names they cover. Only `system/` modules get unit tests; scripts are verified by running them.
- Use `bun:test` with the Bun runner; no external test dependencies are needed.
- Clean up temporary files and directories in `beforeAll`/`afterAll` hooks.
- Run `bun run bun:test` before finishing a change.

## Commit messages

Format: `(prefix) <Short description>`

The short description starts with an uppercase letter.

| Prefix | Use for |
| --- | --- |
| `(new)` | New features, added stuff |
| `(fix)` | Bug fixes, hot fixes |
| `(refactor)` | Code optimizations, minor edits |
| `(chore)` | Configurations, documentation |
| `(ui)` | UI/UX changes, frontend only |

Examples:

```text
(new) Add env-aware OpenCode launcher
(fix) Restore GitHub MCP authorization header
(chore) Document .env and contribution rules
```
