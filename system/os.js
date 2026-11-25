import {
  arch as nodeArch,
  hostname as nodeHostname,
  platform as nodePlatform,
  uptime as nodeUptime
} from "node:os";

/**
 * Returns the OS platform name.
 *
 * @returns {string} Platform name.
 */
const platform = () => nodePlatform();

/**
 * Returns the CPU architecture.
 *
 * @returns {string} Architecture name.
 */
const architecture = () => nodeArch();

/**
 * Returns the machine hostname.
 *
 * @returns {string} Hostname.
 */
const hostname = () => nodeHostname();

/**
 * Returns the system uptime in seconds.
 *
 * @returns {number} Uptime in seconds.
 */
const uptime = () => nodeUptime();

export {
  platform,
  architecture,
  hostname,
  uptime
};
