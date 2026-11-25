import {
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync
} from "node:fs";
import {
  dirname,
  extname,
  join as pathJoin,
  normalize as pathNormalize,
  parse as pathParse,
  resolve as pathResolve
} from "node:path";

/**
 * Creates a PathError that can be thrown.
 *
 * @param {string} message - Error message.
 * @param {unknown} [cause] - Underlying failure.
 * @returns {object} Plain error value.
 */
const PathError = (message, cause) => ({
  name: "PathError",
  message,
  cause
});

/**
 * Runs a filesystem operation, wrapping failures in PathError.
 *
 * @param {string} message - Error message.
 * @param {Function} fn - Operation to run.
 * @returns {unknown} Operation result.
 */
const perform = (message, fn) => {
  try {
    return fn();
  } catch (cause) {
    throw PathError(message, cause);
  }
};

/**
 * Resolves path segments to an absolute path.
 *
 * @param {...string} parts - Path segments.
 * @returns {string} Absolute path.
 */
const resolve = (...parts) => pathResolve(...parts);

/**
 * Joins path segments.
 *
 * @param {...string} parts - Path segments.
 * @returns {string} Joined path.
 */
const join = (...parts) => pathJoin(...parts);

/**
 * Normalizes a path.
 *
 * @param {string} input - Path to normalize.
 * @returns {string} Normalized path.
 */
const normalize = (input) => pathNormalize(input);

/**
 * Returns the basename without its extension.
 *
 * @param {string} input - Path to inspect.
 * @returns {string} Basename without extension.
 */
const base = (input) => pathParse(input).name;

/**
 * Returns the extension without a leading dot.
 *
 * @param {string} input - Path to inspect.
 * @returns {string} Extension, or "" when absent.
 */
const extension = (input) => extname(input).replace(/^\./, "");

/**
 * Returns the parent directory.
 *
 * @param {string} input - Path to inspect.
 * @returns {string} Parent directory.
 */
const parent = (input) => dirname(input);

/**
 * Returns the root of a path.
 *
 * @param {string} input - Path to inspect.
 * @returns {string} Root prefix.
 */
const root = (input) => pathParse(input).root;

/**
 * Returns synchronous metadata for a path.
 *
 * @param {string} input - Path to inspect.
 * @returns {object} Node stats object.
 */
const inspect = (input) => statSync(input);

/**
 * Creates an empty file or directory, skipping paths that already exist.
 *
 * @param {string} path - Path to create.
 * @param {object} [options={}] - Options.
 * @param {boolean} [options.directory] - Create a directory instead of a file.
 * @returns {string} The path.
 */
const create = (path, options = {}) => {
  if (existsSync(path)) return path;

  return perform(`Unable to create path: ${path}`, () => {
    if (options.directory) mkdirSync(path, { recursive: true });
    else writeFileSync(path, "");
    return path;
  });
};

/**
 * Removes a file or directory, optionally with force.
 *
 * @param {string} path - Path to remove.
 * @param {object} [options={}] - Options.
 * @param {boolean} [options.force] - Remove recursively and ignore missing paths.
 * @returns {string} The path removed.
 */
const remove = (path, options = {}) => perform(`Unable to remove path: ${path}`, () => {
  const force = options.force ?? false;
  rmSync(path, {
    recursive: force,
    force
  });
  return path;
});

/**
 * Moves or renames a path.
 *
 * @param {string} from - Source path.
 * @param {string} to - Destination path.
 * @returns {string} The destination path.
 */
const move = (from, to) => perform(`Unable to move ${from} to ${to}`, () => {
  renameSync(from, to);
  return to;
});

/**
 * Lists directory entries, optionally recursively or tolerating a missing path.
 *
 * @param {string} path - Directory path.
 * @param {object} [options={}] - Options.
 * @param {boolean} [options.force] - Return an empty list when the path is missing.
 * @param {boolean} [options.recursive] - Include nested entries.
 * @returns {string[]} Entry names.
 */
const list = (path, options = {}) => perform(`Unable to list directory: ${path}`, () => {
  if (options.force && !existsSync(path)) return [];

  return readdirSync(path, {
    recursive: options.recursive ?? false
  });
});

/**
 * Returns plain metadata for an existing path.
 *
 * @param {string} path - Path to inspect.
 * @returns {object} Plain metadata.
 */
const details = (path) => {
  if (!existsSync(path)) throw PathError(`Path does not exist: ${path}`);

  const info = perform(`Unable to inspect path: ${path}`, () => inspect(path));

  return {
    size: info.size,
    file: info.isFile(),
    directory: info.isDirectory(),
    created: info.birthtime.toISOString(),
    modified: info.mtime.toISOString()
  };
};

export {
  resolve,
  join,
  normalize,
  base,
  extension,
  parent,
  root,
  create,
  remove,
  move,
  list,
  details
};
