import { constants } from "node:os";
import process from "node:process";

/**
 * Frozen map of signal names to numbers.
 *
 * @type {object}
 */
const SIGNALS = Object.freeze({ ...constants.signals });

/**
 * Registers a signal handler and returns an unsubscribe function.
 *
 * @param {string} signal - Signal name.
 * @param {Function} handler - Handler to register.
 * @returns {Promise<Function>} Unsubscribe function.
 */
const on = async (signal, handler) => {
  process.on(signal, handler);
  return () => process.off(signal, handler);
};

/**
 * Removes a signal handler.
 *
 * @param {string} signal - Signal name.
 * @param {Function} handler - Handler to remove.
 * @returns {Promise<void>} Resolves when removed.
 */
const off = async (signal, handler) => {
  process.off(signal, handler);
};

/**
 * Resolves on the next signal.
 *
 * @param {string} signal - Signal name.
 * @returns {Promise<string>} Signal name received.
 */
const once = (signal) => new Promise((resolve) => process.once(signal, resolve));

export {
  SIGNALS,
  on,
  off,
  once
};
