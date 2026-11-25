import { join } from "node:path";
import {
  cwd,
  execPath
} from "node:process";
import { expect, test } from "bun:test";
import {
  write
} from "../../system/io.js";
import {
  remove,
  resolve
} from "../../system/path.js";
import {
  chdir,
  exec,
  execPath as wrappedExecPath,
  exit,
  spawn
} from "../../system/process.js";

test("exec throws ProcessError for a non-string command", () => {
  let thrown = null;

  try {
    exec(null);
  } catch (error) {
    thrown = error;
  }

  expect(thrown.name).toBe("ProcessError");
});

test("exec returns stdout and a zero code", () => {
  const result = exec("echo ok");
  expect(result.code).toBe(0);
  expect(result.stdout).toBe("ok\n");
  expect(result.stderr).toBe("");
  expect(result.error).toBe(null);
});

test("exec honours an explicit encoding override", () => {
  const command = `"${execPath}" -e "process.stdout.write('café')"`;
  expect(exec(command).stdout).toBe("café");
  expect(exec(command, { encoding: "latin1" }).stdout).toBe("cafÃ©");
});

test("exec reports a non-zero exit code without throwing", () => {
  const result = exec(`"${execPath}" -e "process.exit(3)"`);
  expect(result.code).toBe(3);
});

test("spawn binds stdio to the system file descriptors by default", () => {
  const inherited = spawn(execPath, [
    "-e",
    "process.exit(0)"
  ]);
  const piped = spawn(execPath, [
    "-e",
    "console.log('captured')"
  ], { stdio: "pipe" });

  expect(inherited.code).toBe(0);
  expect(inherited.stdout).toBe("");
  expect(piped.stdout.trim()).toBe("captured");
});

test("spawn returns a plain result with the child code", () => {
  const result = spawn(execPath, [
    "-e",
    "process.exit(0)"
  ], { stdio: "ignore" });

  expect(result.code).toBe(0);
  expect(result.error).toBe(null);
});

test("spawn captures stdout with piped stdio", () => {
  const result = spawn(execPath, [
    "-e",
    "console.log(42)"
  ], { stdio: "pipe" });

  expect(result.code).toBe(0);
  expect(result.stdout).toBe("42\n");
});

test("spawn reports a spawn error", () => {
  const result = spawn("template-missing-executable", [], { stdio: "ignore" });
  expect(result.code).toBe(1);
  expect(result.error.message.length).toBeGreaterThan(0);
});

test("exit terminates a child process with the requested code", () => {
  const path = resolve("/tmp/opencode", "template-exit-child.mjs");
  const modulePath = new URL("../../system/process.js", import.meta.url).pathname;
  write(path, `import { exit } from ${JSON.stringify(modulePath)};\nexit(7);\n`);

  try {
    const result = spawn(execPath, [path], { stdio: "ignore" });
    expect(result.code).toBe(7);
  } finally {
    remove(path);
  }
});

test("exit is exposed as a function", () => {
  expect(typeof exit).toBe("function");
});

test("execPath is re-exported from node:process", () => {
  expect(wrappedExecPath).toBe(execPath);
});

test("chdir changes the working directory and throws ProcessError when invalid", () => {
  const original = cwd();
  try {
    chdir(original);
    let thrown = null;
    try {
      chdir(join(original, "definitely-missing-directory"));
    } catch (error) {
      thrown = error;
    }
    expect(thrown.name).toBe("ProcessError");
  } finally {
    chdir(original);
  }
});
