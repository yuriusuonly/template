import {
  mkdtempSync,
  rmSync
} from "node:fs";
import { tmpdir } from "node:os";
import {
  join as nodeJoin,
  resolve as nodeResolve,
  sep
} from "node:path";
import {
  afterAll,
  beforeAll,
  expect,
  test
} from "bun:test";
import {
  base,
  create,
  details,
  extension,
  join,
  list,
  move,
  normalize,
  parent,
  remove,
  resolve,
  root
} from "../../system/path.js";

let directory;

beforeAll(() => {
  directory = mkdtempSync(nodeJoin(tmpdir(), "template-path-"));
});

afterAll(() => {
  rmSync(directory, {
    recursive: true,
    force: true
  });
});

test("resolve, join, and normalize produce path strings", () => {
  expect(resolve("a", "b")).toBe(nodeResolve("a", "b"));
  expect(join("a", "b")).toBe(`a${sep}b`);
  expect(normalize("a//b")).toBe(`a${sep}b`);
});

test("base, extension, parent, and root inspect paths", () => {
  expect(base("/a/b.txt")).toBe("b");
  expect(extension("/a/b.txt")).toBe("txt");
  expect(parent("/a/b.txt")).toBe("/a");
  expect(root("/a/b.txt")).toBe("/");
});

test("create makes files and directories and skips existing paths", () => {
  const file = nodeJoin(directory, "created.txt");
  const nested = nodeJoin(directory, "nested");

  expect(create(file)).toBe(file);
  expect(create(file)).toBe(file);
  expect(create(nested, { directory: true })).toBe(nested);
  expect(create(nested, { directory: true })).toBe(nested);
  expect(details(file).file).toBe(true);
  expect(details(nested).directory).toBe(true);
});

test("remove deletes paths and force tolerates missing ones", () => {
  const path = nodeJoin(directory, "removed.txt");
  create(path);

  expect(remove(path)).toBe(path);
  expect(() => details(path)).toThrow();
  expect(remove(path, { force: true })).toBe(path);
});

test("move throws PathError when the source is missing", () => {
  let thrown = null;

  try {
    move(nodeJoin(directory, "missing.txt"), nodeJoin(directory, "moved.txt"));
  } catch (error) {
    thrown = error;
  }

  expect(thrown.name).toBe("PathError");
  expect(thrown.cause).toBeTruthy();
});

test("move renames a path", () => {
  const from = nodeJoin(directory, "before.txt");
  const to = nodeJoin(directory, "after.txt");
  create(from);

  expect(move(from, to)).toBe(to);
  expect(details(to).file).toBe(true);
});

test("list supports recursive and force options", () => {
  const target = nodeJoin(directory, "listed");
  create(nodeJoin(target, "inner"), { directory: true });
  create(nodeJoin(target, "inner", "file.txt"));

  expect(list(target)).toContain("inner");
  expect(list(target, { recursive: true })).toContain(nodeJoin("inner", "file.txt"));
  expect(list(nodeJoin(directory, "missing"), { force: true })).toEqual([]);
});

test("details returns plain metadata and throws for missing paths", () => {
  const path = nodeJoin(directory, "details.txt");
  create(path);

  const info = details(path);
  expect(Object.getPrototypeOf(info)).toBe(Object.prototype);
  expect(info.file).toBe(true);
  expect(info.directory).toBe(false);
  expect(typeof info.size).toBe("number");
  expect(() => details(nodeJoin(directory, "missing.txt"))).toThrow();
});
