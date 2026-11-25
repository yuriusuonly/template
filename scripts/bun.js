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
  execPath,
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

const outcome = await debug(() => spawn(execPath, args, {
  cwd: root,
  env: environment
}));

if (outcome.error || outcome.code !== 0) {
  logError(`bun failed (exit ${outcome.code ?? 1})`);
  exit(outcome.code ?? 1);
}
