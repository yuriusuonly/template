import {
  fileURLToPath as nodeFileUrlToPath,
  pathToFileURL as nodePathToFileUrl
} from "node:url";

/**
 * Creates a UriError that can be thrown.
 *
 * @param {string} message - Error message.
 * @param {unknown} [cause] - Underlying failure.
 * @returns {object} Plain error value.
 */
const UriError = (message, cause) => ({
  name: "UriError",
  message,
  cause
});

/**
 * Runs a URI operation, wrapping failures in UriError.
 *
 * @param {string} message - Error message.
 * @param {Function} fn - Operation to run.
 * @returns {unknown} Operation result.
 */
const perform = (message, fn) => {
  try {
    return fn();
  } catch (cause) {
    throw UriError(message, cause);
  }
};

/**
 * Represents a web URL as a plain object, or null when invalid.
 *
 * @param {string} input - URL string.
 * @param {string} [base] - Base URL for relative inputs.
 * @returns {object | null} Plain URL fields.
 */
const url = (input, base) => {
  let uri;

  try {
    uri = new URL(input, base);
  } catch {
    return null;
  }

  return {
    href: uri.href,
    scheme: uri.protocol.replace(/:$/, ""),
    protocol: uri.protocol,
    origin: uri.origin,
    username: uri.username,
    password: uri.password,
    host: uri.host,
    hostname: uri.hostname,
    port: uri.port,
    pathname: uri.pathname,
    search: uri.search,
    hash: uri.hash,
    query: Object.fromEntries(uri.searchParams.entries())
  };
};

/**
 * Encodes a URI string.
 *
 * @param {string} input - URI to encode.
 * @returns {string} Encoded URI.
 */
const encode = (input) => perform("Unable to encode URI", () => encodeURI(input));

/**
 * Decodes a URI string.
 *
 * @param {string} input - URI to decode.
 * @returns {string} Decoded URI.
 */
const decode = (input) => perform("Unable to decode URI", () => decodeURI(input));

/**
 * Encodes a URI component string.
 *
 * @param {string} input - Component to encode.
 * @returns {string} Encoded component.
 */
const encodeUriComponent = (input) => perform("Unable to encode URI component", () => encodeURIComponent(input));

/**
 * Decodes a URI component string.
 *
 * @param {string} input - Component to decode.
 * @returns {string} Decoded component.
 */
const decodeUriComponent = (input) => perform("Unable to decode URI component", () => decodeURIComponent(input));

/**
 * Converts a file URL to a filesystem path.
 *
 * @param {string | URL} input - File URL string or URL instance.
 * @returns {string} Filesystem path.
 */
const fileUrlToPath = (input) => perform("Unable to convert file URL to path", () => {
  const value = typeof input === "string" ? input : input?.href;
  if (typeof value !== "string") throw new TypeError("Expected a file URL string or URL instance");
  return nodeFileUrlToPath(value);
});

/**
 * Converts a filesystem path to a file URL string.
 *
 * @param {string} path - Filesystem path.
 * @returns {string} File URL string.
 */
const pathToFileUrl = (path) => perform("Unable to convert path to file URL", () => nodePathToFileUrl(path).href);

export {
  url,
  encode,
  decode,
  encodeUriComponent,
  decodeUriComponent,
  fileUrlToPath,
  pathToFileUrl
};
