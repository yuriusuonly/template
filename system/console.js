import builtinConsole from "node:console";
import { hrtime } from "node:process";
import { inspect } from "node:util";

/**
 * Creates a ConsoleError that can be thrown.
 *
 * @param {string} message - Error message.
 * @param {unknown} [cause] - Underlying failure.
 * @returns {object} Plain error value.
 */
const ConsoleError = (message, cause) => ({
  name: "ConsoleError",
  message,
  cause
});

/**
 * Builds a plain duration breakdown from a start timestamp.
 *
 * @param {bigint} start - Start from `hrtime.bigint()`.
 * @returns {object} Plain duration fields.
 */
const duration = (start) => {
  const nanoseconds = Number(hrtime.bigint() - start);

  return {
    nanoseconds,
    microseconds: nanoseconds / 1e3,
    milliseconds: nanoseconds / 1e6,
    seconds: nanoseconds / 1e9
  };
};

/**
 * Runs a function and reports its outcome and timing without throwing.
 *
 * @param {Function} fn - Function to run.
 * @returns {Promise<object>} Plain measurement with `result`, `duration`, and `error`.
 */
const measure = async (fn) => {
  const start = hrtime.bigint();

  try {
    return {
      result: await fn(),
      duration: duration(start),
      error: null
    };
  } catch (error) {
    return {
      result: null,
      duration: duration(start),
      error
    };
  }
};

/**
 * Renders object values with unlimited depth and automatic indentation.
 *
 * @param {unknown} value - Value to render.
 * @returns {unknown} String for objects, original value otherwise.
 */
const render = (value) => {
  if (typeof value !== "object" || value === null) return value;

  return inspect(value, {
    depth: null,
    compact: false
  });
};

/**
 * Calls a built-in console method with rendered values.
 *
 * @param {string} method - Console method name.
 * @param {unknown[]} values - Values to pass through.
 * @returns {void}
 */
const call = (method, values) => {
  try {
    builtinConsole[method](...values.map(render));
  } catch (cause) {
    throw ConsoleError(`Unable to call console.${method}`, cause);
  }
};

/**
 * Prints informative messages, such as success notices.
 *
 * @param {...unknown} values - Values to print.
 * @returns {void}
 */
const info = (...values) => call("info", values);

/**
 * Prints warning messages.
 *
 * @param {...unknown} values - Values to print.
 * @returns {void}
 */
const warn = (...values) => call("warn", values);

/**
 * Prints an error message.
 *
 * @param {...unknown} values - Values to print.
 * @returns {void}
 */
const error = (...values) => call("error", values);

/**
 * Runs a sync or async task with its arguments, then prints only the elapsed time.
 *
 * @param {Function} task - Function to run and time.
 * @param {...unknown} args - Arguments to pass to the task.
 * @returns {Promise<unknown>} The task result.
 */
const debug = async (task, ...args) => {
  const measured = await measure(() => task(...args));

  call("debug", [
    `${measured.duration.milliseconds.toFixed(3)}ms`
  ]);

  if (measured.error) throw measured.error;
  return measured.result;
};

/**
 * Prints a stack trace.
 *
 * @param {...unknown} values - Values to print with the trace.
 * @returns {void}
 */
const trace = (...values) => call("trace", values);

export {
  info,
  warn,
  error,
  debug,
  trace
};
