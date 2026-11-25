import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { env } from "node:process";
import { afterAll, beforeAll, expect, test } from "bun:test";
import {
  DEFAULT_PATH,
  env as wrappedEnv,
  load,
  optional,
  parse,
  required
} from "../../system/environment.js";

let root;

beforeAll(async () => {
  root = await mkdtemp(join(tmpdir(), "template-env-"));
});

afterAll(async () => {
  await rm(root, {
    recursive: true,
    force: true
  });
});

test("env is the process environment object", () => {
  expect(wrappedEnv).toBe(env);
});

test("parse strips quotes and ignores comments and blanks", () => {
  expect(parse("# note\nA=\"one\"\n\nB=two\n")).toEqual({
    A: "one",
    B: "two"
  });
});

test("load reads a .env file into a plain map", async () => {
  const path = join(root, ".env");
  await writeFile(path, "NAME=\"demo\"\nPORT=\"8000\"\n");

  const values = await load(path);
  expect(Object.getPrototypeOf(values)).toBe(Object.prototype);
  expect(values).toEqual({
    NAME: "demo",
    PORT: "8000"
  });
});

test("DEFAULT_PATH resolves .env from the working directory", () => {
  expect(DEFAULT_PATH).toMatch(/\.env$/);
});

test("load throws EnvironmentError when the file is missing", async () => {
  let thrown = null;

  try {
    await load(join(root, "missing.env"));
  } catch (error) {
    thrown = error;
  }

  expect(thrown).not.toBe(null);
  expect(thrown.name).toBe("EnvironmentError");
  expect(thrown.cause).toBeTruthy();
});

test("load tolerates a missing file when optional", async () => {
  expect(await load(join(root, "missing-optional.env"), { optional: true })).toEqual({});
});

test("optional and required read the environment", () => {
  env.ANOMALIES_TEST_KEY = "value";

  try {
    expect(optional("ANOMALIES_TEST_KEY", "fallback")).toBe("value");
    expect(optional("ANOMALIES_MISSING", "fallback")).toBe("fallback");
    expect(required("ANOMALIES_TEST_KEY")).toBe("value");
  } finally {
    delete env.ANOMALIES_TEST_KEY;
  }
});

test("required throws EnvironmentError for a missing variable", () => {
  let thrown = null;

  try {
    required("ANOMALIES_MISSING_REQUIRED");
  } catch (error) {
    thrown = error;
  }

  expect(thrown.name).toBe("EnvironmentError");
});
