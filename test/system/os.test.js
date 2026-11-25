import { expect, test } from "bun:test";
import {
  architecture,
  hostname,
  platform,
  uptime
} from "../../system/os.js";

test("platform, architecture, and hostname return strings", () => {
  expect(typeof platform()).toBe("string");
  expect(typeof architecture()).toBe("string");
  expect(typeof hostname()).toBe("string");
});

test("uptime returns a number", () => {
  expect(typeof uptime()).toBe("number");
});
