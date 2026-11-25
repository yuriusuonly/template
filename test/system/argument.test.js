import { expect, test } from "bun:test";
import { argv } from "node:process";
import {
  argv as wrappedArgv,
  parse,
  raw,
  stringify
} from "../../system/argument.js";

const OPTIONS = {
  verbose: { type: "boolean" },
  name: { type: "string" }
};

test("argv is the process argv array", () => {
  expect(wrappedArgv).toBe(argv);
});

test("raw preserves token order and returns a copy", () => {
  const tokens = [
    "add",
    "github/github-mcp-server",
    "--skill",
    "*"
  ];
  const result = raw(tokens);

  expect(result).toEqual(tokens);
  expect(result).not.toBe(tokens);
});

test("parse throws ArgumentError for non-array input", () => {
  let thrown = null;

  try {
    parse("demo");
  } catch (error) {
    thrown = error;
  }

  expect(thrown).not.toBe(null);
  expect(thrown.name).toBe("ArgumentError");
});

test("parse maps declared booleans and strings", () => {
  expect(parse([
    "--verbose",
    "--name",
    "demo"
  ], { options: OPTIONS })).toEqual({
    verbose: true,
    name: "demo",
    _: []
  });
});

test("parse supports inline values, short flags, and positional tokens", () => {
  expect(parse([
    "--name=demo",
    "-v",
    "--",
    "plain"
  ], {
    options: {
      verbose: {
        type: "boolean",
        short: "v"
      },
      name: { type: "string" }
    }
  })).toEqual({
    verbose: true,
    name: "demo",
    _: ["plain"]
  });
});

test("parse gives short flags a following value", () => {
  expect(parse([
    "-n",
    "demo"
  ], {
    options: {
      name: {
        type: "string",
        short: "n"
      }
    }
  })).toEqual({
    name: "demo",
    _: []
  });
});

test("parse keeps trailing positional tokens and lone hyphens", () => {
  expect(parse([
    "--flag",
    "file.txt",
    "-"
  ], {
    options: { flag: { type: "string" } }
  })).toEqual({
    flag: "file.txt",
    _: ["-"]
  });
});

test("stringify rebuilds equivalent CLI tokens", () => {
  const parsed = parse([
    "mcp",
    "list",
    "--standalone",
    "--log-level",
    "debug"
  ], {
    options: {
      standalone: { type: "boolean" },
      "log-level": { type: "string" }
    }
  });

  expect(stringify(parsed)).toEqual([
    "--standalone",
    "--log-level",
    "debug",
    "mcp",
    "list"
  ]);
});
