import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  cwd,
  env as processEnv
} from "node:process";
import { parseEnv } from "node:util";

/**
 * Creates an EnvironmentError that can be thrown.
 *
 * @param {string} message - Error message.
 * @param {unknown} [cause] - Underlying failure.
 * @returns {object} Plain error value.
 */
const EnvironmentError = (message, cause) => ({
  name: "EnvironmentError",
  message,
  cause
});

/**
 * Default `.env` path, resolved from the working directory at import time.
 *
 * @type {string}
 */
const DEFAULT_PATH = resolve(cwd(), ".env");

/**
 * Parses `.env` contents into a plain map using `node:util.parseEnv`.
 *
 * @param {string} contents - `.env` file contents.
 * @returns {object} Plain key-value map.
 */
const parse = (contents) => ({ ...parseEnv(contents) });

/**
 * Loads and parses a `.env` file.
 *
 * @param {string} [path=DEFAULT_PATH] - Path to the file.
 * @param {object} [options={}] - Options.
 * @param {boolean} [options.optional] - Return an empty map when the file is missing.
 * @returns {Promise<object>} Parsed environment map.
 */
const load = async (path = DEFAULT_PATH, options = {}) => {
  try {
    return parse(await readFile(path, "utf8"));
  } catch (cause) {
    if (options.optional && cause?.code === "ENOENT") return {};
    throw EnvironmentError(`Unable to load env file: ${path}`, cause);
  }
};

/**
 * Reads one environment variable with a fallback.
 *
 * @param {string} name - Variable name.
 * @param {string} fallback - Fallback value.
 * @returns {string} Value or fallback.
 */
const optional = (name, fallback) => processEnv[name] ?? fallback;

/**
 * Reads an environment variable that must be set.
 *
 * @param {string} name - Variable name.
 * @returns {string} Variable value.
 */
const required = (name) => {
  const value = processEnv[name];
  if (value === undefined) throw EnvironmentError(`Missing environment variable: ${name}`);
  return value;
};

export {
  DEFAULT_PATH,
  parse,
  load,
  optional,
  required,
  processEnv as env
};
