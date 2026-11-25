import { constants } from "node:os";
import process from "node:process";
import { expect, test } from "bun:test";
import {
  off,
  on,
  once,
  SIGNALS
} from "../../system/signal.js";

test("SIGNALS mirrors the OS signal constants", () => {
  expect(SIGNALS.SIGINT).toBe(constants.signals.SIGINT);
  expect(SIGNALS.SIGTERM).toBe(constants.signals.SIGTERM);
});

test("on registers a handler and returns an unsubscribe function", async () => {
  const calls = [];
  const handler = () => calls.push(true);
  const unsubscribe = await on("template:on", handler);

  process.emit("template:on");
  expect(calls.length).toBe(1);

  await unsubscribe();
  process.emit("template:on");
  expect(calls.length).toBe(1);
});

test("off removes a handler", async () => {
  const calls = [];
  const handler = () => calls.push(true);

  await on("template:off", handler);
  process.emit("template:off");
  expect(calls.length).toBe(1);

  await off("template:off", handler);
  process.emit("template:off");
  expect(calls.length).toBe(1);
});

test("once resolves with the event name", async () => {
  const pending = once("template:once");
  process.emit("template:once");
  expect(await pending).toBeUndefined();
});
