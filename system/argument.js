import { argv } from "node:process";
import { parseArgs } from "node:util";

/**
 * Creates an ArgumentError that can be thrown.
 *
 * @param {string} message - Error message.
 * @param {unknown} [cause] - Underlying failure.
 * @returns {object} Plain error value.
 */
const ArgumentError = (message, cause) => ({
  name: "ArgumentError",
  message,
  cause
});

/**
 * Parses CLI tokens with the built-in `util.parseArgs`.
 *
 * @param {string[]} [values=argv.slice(2)] - Tokens to parse.
 * @param {object} [config={}] - `parseArgs` config: `options`, `strict`, `allowPositionals`, etc.
 * @returns {object} Plain flag map with positionals under `_`.
 */
const parse = (values = argv.slice(2), config = {}) => {
  if (!Array.isArray(values)) throw ArgumentError("Expected an array of CLI tokens");

  const result = parseArgs({
    ...config,
    args: values,
    allowPositionals: config.allowPositionals ?? true,
    strict: config.strict ?? false
  });

  return {
    ...result.values,
    _: result.positionals
  };
};

/**
 * Converts a parsed flag map back into CLI tokens.
 *
 * @param {object} parsed - Parsed flag map.
 * @returns {string[]} Tokens for a child process.
 */
const stringify = (parsed) => {
  const values = [];

  for (const [name, value] of Object.entries(parsed)) {
    if (name === "_") {
      values.push(...value);
      continue;
    }

    if (value === true) values.push(`--${name}`);
    else values.push(`--${name}`, String(value));
  }

  return values;
};

/**
 * Returns a copy of the raw CLI tokens in their original order.
 *
 * @param {string[]} [values=argv.slice(2)] - Tokens to return.
 * @returns {string[]} Raw tokens.
 */
const raw = (values = argv.slice(2)) => values.slice();

export {
  parse,
  stringify,
  raw,
  argv
};
