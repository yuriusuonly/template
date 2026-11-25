#!/usr/bin/env bun
import { raw as rawArguments } from "../system/argument.js";
import {
  debug,
  error as logError
} from "../system/console.js";
import {
  env as processEnv,
  load as loadEnvironment
} from "../system/environment.js";
import {
  join,
  parent,
  resolve
} from "../system/path.js";
import {
  chdir,
  exit,
  spawn
} from "../system/process.js";
import { fileUrlToPath } from "../system/uri.js";

const root = resolve(parent(parent(fileUrlToPath(import.meta.url))));

chdir(root);

const args = rawArguments();

const environment = {
  ...processEnv,
  ...(await loadEnvironment(join(root, ".env"), { optional: true }))
};
const cli = join(root, "node_modules", ".bin", "opencode");

const outcome = await debug(() => spawn(cli, args, {
  cwd: root,
  env: environment
}));

if (outcome.error || outcome.code !== 0) {
  logError(`opencode failed (exit ${outcome.code ?? 1})`);
  exit(outcome.code ?? 1);
}
