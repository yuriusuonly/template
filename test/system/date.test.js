import { expect, test } from "bun:test";
import {
  add,
  difference,
  epoch,
  format,
  now,
  parse
} from "../../system/date.js";

const SAMPLE = "2026-01-02T03:04:05.678Z";

test("now returns an ISO string and epoch returns a number", () => {
  expect(now()).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  expect(typeof epoch()).toBe("number");
});

test("parse returns plain UTC fields", () => {
  const value = parse(SAMPLE);
  expect(Object.getPrototypeOf(value)).toBe(Object.prototype);
  expect(value.valid).toBe(true);
  expect(value.year).toBe(2026);
  expect(value.month).toBe(1);
  expect(value.day).toBe(2);
  expect(value.hour).toBe(3);
  expect(value.timezone).toBe("UTC");
});

test("parse marks invalid input and format returns an empty string", () => {
  expect(parse("not-a-date").valid).toBe(false);
  expect(format("not-a-date")).toBe("");
  expect(parse(SAMPLE).valid).toBe(true);
});

test("format supports date, time, and compact styles", () => {
  expect(format(SAMPLE)).toBe(SAMPLE);
  expect(format(SAMPLE, "date")).toBe("2026-01-02");
  expect(format(SAMPLE, "time")).toBe("03:04:05");
  expect(format(SAMPLE, "compact")).toBe("0102_0304");
});

test("add and difference operate on epoch milliseconds", () => {
  expect(add(SAMPLE, 1000)).toBe("2026-01-02T03:04:06.678Z");
  expect(difference(SAMPLE, add(SAMPLE, 1000))).toBe(1000);
  expect(difference("not-a-date", SAMPLE)).toBe(0);
});
