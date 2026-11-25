import { pathToFileURL } from "node:url";
import { expect, test } from "bun:test";
import {
  decode,
  decodeUriComponent,
  encode,
  encodeUriComponent,
  fileUrlToPath,
  pathToFileUrl,
  url
} from "../../system/uri.js";

test("exports only the URI helpers", async () => {
  const module = await import("../../system/uri.js");
  expect(Object.keys(module).sort()).toEqual([
    "decode",
    "decodeUriComponent",
    "encode",
    "encodeUriComponent",
    "fileUrlToPath",
    "pathToFileUrl",
    "url"
  ]);
});

test("url returns plain web URL fields", () => {
  const value = url("https://example.com:8443/a/b?x=1#frag");

  expect(Object.getPrototypeOf(value)).toBe(Object.prototype);
  expect(value.scheme).toBe("https");
  expect(value.protocol).toBe("https:");
  expect(value.hostname).toBe("example.com");
  expect(value.port).toBe("8443");
  expect(value.pathname).toBe("/a/b");
  expect(value.hash).toBe("#frag");
  expect(value.query).toEqual({
    x: "1"
  });
});

test("url returns null for invalid input", () => {
  expect(url("not-a-uri")).toBe(null);
});

test("url resolves relative input against a base", () => {
  const value = url("/relative", "https://example.com");
  expect(value.href).toBe("https://example.com/relative");
});

test("encode and decode round-trip a URI string", () => {
  const source = "https://example.com/a b?q=x y";
  const encoded = encode(source);

  expect(encoded).toBe("https://example.com/a%20b?q=x%20y");
  expect(decode(encoded)).toBe(source);
});

test("encode and decode throw UriError for malformed input", () => {
  let thrown = null;
  try {
    decode("%E0%A4%A");
  } catch (error) {
    thrown = error;
  }
  expect(thrown.name).toBe("UriError");
  expect(thrown.cause).toBeTruthy();
});

test("component encoding escapes reserved characters", () => {
  const source = "a/b?c=d&e=f";
  expect(encodeUriComponent(source)).toBe("a%2Fb%3Fc%3Dd%26e%3Df");
  expect(decodeUriComponent(encodeUriComponent(source))).toBe(source);
  expect(encode(source)).toContain("/");
});

test("component decoding throws UriError for malformed input", () => {
  let thrown = null;
  try {
    decodeUriComponent("%E0%A4%A");
  } catch (error) {
    thrown = error;
  }
  expect(thrown.name).toBe("UriError");
  expect(thrown.cause).toBeTruthy();
});

test("fileUrlToPath converts a file URL string or URL instance", () => {
  const source = "/tmp/a b.txt";
  const href = pathToFileURL(source).href;

  expect(fileUrlToPath(href)).toBe(source);
  expect(fileUrlToPath(new URL(href))).toBe(source);
});

test("fileUrlToPath throws UriError for invalid input", () => {
  let thrown = null;
  try {
    fileUrlToPath(42);
  } catch (error) {
    thrown = error;
  }
  expect(thrown.name).toBe("UriError");
  expect(thrown.cause).toBeTruthy();
});

test("pathToFileUrl converts a path to a file URL string", () => {
  const source = "/tmp/a b.txt";
  expect(pathToFileUrl(source)).toBe(pathToFileURL(source).href);
});
