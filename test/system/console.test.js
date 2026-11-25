import builtinConsole from "node:console";
import * as logger from "../../system/console.js";
import { expect, test } from "bun:test";

/**
 * Captures calls to built-in console methods while running a function.
 *
 * @param {string[]} methods - Built-in methods to capture.
 * @param {Function} fn - Function to run.
 * @returns {Promise<object>} Map of method names to captured argument arrays.
 */
const capture = async (methods, fn) => {
  const originals = {};
  const calls = {};

  for (const method of methods) {
    originals[method] = builtinConsole[method];
    calls[method] = [];
    builtinConsole[method] = (...values) => calls[method].push(values);
  }

  try {
    await fn();
  } finally {
    for (const method of methods) {
      builtinConsole[method] = originals[method];
    }
  }

  return calls;
};

test("exports only info, warn, error, debug, and trace", () => {
  for (const name of [
    "debug",
    "error",
    "info",
    "trace",
    "warn"
  ]) {
    expect(typeof logger[name]).toBe("function");
  }

  expect(logger.log).toBeUndefined();
  expect(logger.levels).toBeUndefined();
  expect(logger.setLevel).toBeUndefined();
  expect(logger.getLevel).toBeUndefined();
});

test("info and warn delegate only to their built-ins", async () => {
  const infos = await capture([
    "info",
    "trace"
  ], () => logger.info("note"));
  expect(infos.info).toEqual([
    ["note"]
  ]);
  expect(infos.trace.length).toBe(0);

  const warns = await capture([
    "warn",
    "trace"
  ], () => logger.warn("careful"));
  expect(warns.warn).toEqual([
    ["careful"]
  ]);
  expect(warns.trace.length).toBe(0);
});

test("error prints only the message", async () => {
  const calls = await capture([
    "error",
    "trace"
  ], () => logger.error("boom"));

  expect(calls.error).toEqual([
    ["boom"]
  ]);
  expect(calls.trace.length).toBe(0);
});

test("trace is an individual wrapper", async () => {
  const calls = await capture(["trace"], () => logger.trace("here"));
  expect(calls.trace).toEqual([
    ["here"]
  ]);
});

test("debug runs a sync task with arguments and prints only its elapsed time", async () => {
  let result = null;
  const calls = await capture(["debug", "trace"], async () => {
    result = await logger.debug((first, second) => first + second, 2, 3);
  });

  expect(result).toBe(5);
  expect(calls.debug[0].length).toBe(1);
  expect(calls.debug[0][0]).toMatch(/^\d+\.\d{3}ms$/);
  expect(calls.trace.length).toBe(0);
});

test("debug awaits an async task with arguments", async () => {
  let result = null;
  const calls = await capture(["debug", "trace"], async () => {
    result = await logger.debug(async (value) => {
      await Promise.resolve();
      return value.toUpperCase();
    }, "done");
  });

  expect(result).toBe("DONE");
  expect(calls.debug[0].length).toBe(1);
  expect(calls.debug[0][0]).toMatch(/^\d+\.\d{3}ms$/);
  expect(calls.trace.length).toBe(0);
});

test("debug still reports and rethrows the original error object", async () => {
  const failure = new Error("boom");
  const calls = await capture(["debug", "trace"], async () => {
    let thrown = null;
    try {
      await logger.debug(() => {
        throw failure;
      });
    } catch (caught) {
      thrown = caught;
    }
    expect(thrown).toBe(failure);
  });

  expect(calls.debug.length).toBe(1);
  expect(calls.trace.length).toBe(0);
});

test("object values are inspected with full depth and indentation", async () => {
  const calls = await capture([
    "info",
    "trace"
  ], () => logger.info({
    outer: {
      inner: { key: 1 }
    }
  }));

  expect(typeof calls.info[0][0]).toBe("string");
  expect(calls.info[0][0]).toContain("key: 1");
  expect(calls.info[0][0]).toContain("\n");
});

test("primitive and null values pass through unchanged", async () => {
  const calls = await capture([
    "info",
    "trace"
  ], () => logger.info("hello", 42, true, null));

  expect(calls.info).toEqual([
    [
      "hello",
      42,
      true,
      null
    ]
  ]);
});

test("a wrapper throws ConsoleError when the built-in fails", async () => {
  const original = builtinConsole.info;
  builtinConsole.info = () => {
    throw new Error("boom");
  };

  let thrown = null;
  try {
    logger.info("x");
  } catch (caught) {
    thrown = caught;
  } finally {
    builtinConsole.info = original;
  }

  expect(thrown.name).toBe("ConsoleError");
  expect(thrown.cause.message).toBe("boom");
});
