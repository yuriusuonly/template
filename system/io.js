import {
  appendFileSync,
  readFileSync,
  writeFileSync
} from "node:fs";

/**
 * Creates an IoError that can be thrown.
 *
 * @param {string} message - Error message.
 * @param {unknown} [cause] - Underlying failure.
 * @returns {object} Plain error value.
 */
const IoError = (message, cause) => ({
  name: "IoError",
  message,
  cause
});

/**
 * Runs a file operation, wrapping failures in IoError.
 *
 * @param {string} message - Error message.
 * @param {Function} fn - Operation to run.
 * @returns {unknown} Operation result.
 */
const perform = (message, fn) => {
  try {
    return fn();
  } catch (cause) {
    throw IoError(message, cause);
  }
};

/**
 * Reads a file as a Buffer, or as text when an encoding is given.
 *
 * @param {string} path - File path.
 * @param {BufferEncoding} [encoding] - Optional text encoding.
 * @returns {Buffer | string} File contents.
 */
const read = (path, encoding) => perform(`Unable to read file: ${path}`, () => readFileSync(path, encoding));

/**
 * Writes data to a file, optionally appending.
 *
 * @param {string} path - File path.
 * @param {string | Buffer | Uint8Array} data - Data to write.
 * @param {object} [options={}] - Options.
 * @param {boolean} [options.append] - Append instead of overwriting.
 * @returns {string} The path written.
 */
const write = (path, data, options = {}) => perform(`Unable to write file: ${path}`, () => {
  if (options.append) appendFileSync(path, data);
  else writeFileSync(path, data);
  return path;
});

export {
  read,
  write
};
