import {
  mkdtempSync,
  rmSync
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  afterAll,
  beforeAll,
  expect,
  test
} from "bun:test";
import {
  read,
  write
} from "../../system/io.js";

let root;

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), "template-io-"));
});

afterAll(() => {
  rmSync(root, {
    recursive: true,
    force: true
  });
});

test("read throws IoError when the file is missing", () => {
  let thrown = null;

  try {
    read(join(root, "missing-read.txt"));
  } catch (error) {
    thrown = error;
  }

  expect(thrown.name).toBe("IoError");
  expect(thrown.cause).toBeTruthy();
});

test("read returns a Buffer without encoding and text with one", () => {
  const path = join(root, "text.txt");
  write(path, "hello");

  expect(read(path)).toEqual(Buffer.from("hello"));
  expect(read(path, "utf8")).toBe("hello");
});

test("write overwrites by default and appends when requested", () => {
  const path = join(root, "write.txt");
  write(path, "first");
  write(path, "second");
  expect(read(path, "utf8")).toBe("second");

  write(path, " third", { append: true });
  expect(read(path, "utf8")).toBe("second third");
});
