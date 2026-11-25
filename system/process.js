import {
  execSync,
  spawnSync
} from "node:child_process";
import {
  chdir as chdirProcess,
  env as processEnv,
  execPath,
  exit as exitProcess,
  stderr as processStderr,
  stdin as processStdin,
  stdout as processStdout
} from "node:process";

/**
 * Default stdio mapping that attaches a child to real numeric system file descriptors.
 *
 * @type {number[]}
 */
const systemStdio = [
  typeof processStdin.fd === "number" ? processStdin.fd : 0,
  typeof processStdout.fd === "number" ? processStdout.fd : 1,
  typeof processStderr.fd === "number" ? processStderr.fd : 2
];

/**
 * Creates a ProcessError that can be thrown.
 *
 * @param {string} message - Error message.
 * @param {unknown} [cause] - Underlying failure.
 * @returns {object} Plain error value.
 */
const ProcessError = (message, cause) => ({
  name: "ProcessError",
  message,
  cause
});

/**
 * Runs a command synchronously and returns its outcome instead of throwing.
 *
 * @param {string} command - Command string.
 * @param {object} [options={}] - Exec options, including an optional `encoding` (default "utf8").
 * @returns {object} Plain result with code, stdout, stderr, and error.
 */
const exec = (command, options = {}) => {
  if (typeof command !== "string") throw ProcessError("Command must be a string");

  const {
    cwd,
    env,
    encoding,
    ...rest
  } = options;

  try {
    const stdout = execSync(command, {
      ...rest,
      cwd,
      env: env ?? processEnv,
      encoding: encoding ?? "utf8"
    });

    return {
      code: 0,
      stdout: stdout ?? "",
      stderr: "",
      error: null
    };
  } catch (error) {
    return {
      code: typeof error.status === "number" ? error.status : 1,
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? "",
      error: {
        message: error.message,
        code: error.code
      }
    };
  }
};

/**
 * Spawns a child synchronously and returns a plain result.
 *
 * @param {string} command - Executable path or name.
 * @param {string[]} [args=[]] - Arguments.
 * @param {object} [options={}] - Spawn options.
 * @returns {object} Plain result with code, signal, stdout, stderr, and error.
 */
const spawn = (command, args = [], options = {}) => {
  const result = spawnSync(command, args, {
    ...options,
    env: options.env ?? processEnv,
    encoding: options.encoding ?? "utf8",
    stdio: options.stdio ?? systemStdio
  });

  return {
    code: result.status ?? 1,
    signal: result.signal ?? null,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    error: result.error ? {
      message: result.error.message,
      code: result.error.code
    } : null
  };
};

/**
 * Changes the working directory.
 *
 * @param {string} path - Directory path.
 * @returns {void}
 */
const chdir = (path) => {
  try {
    chdirProcess(path);
  } catch (cause) {
    throw ProcessError(`Unable to change directory: ${path}`, cause);
  }
};

/**
 * Exits the process with a status code.
 *
 * @param {number} [code=0] - Exit code.
 * @returns {void}
 */
const exit = (code = 0) => exitProcess(code);

export {
  exec,
  spawn,
  exit,
  chdir,
  execPath
};
