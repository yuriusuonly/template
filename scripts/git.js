#!/usr/bin/env bun
import { raw as rawArguments } from "../system/argument.js";
import {
  debug,
  error as logError,
} from "../system/console.js";
import {
  env as processEnv,
  load as loadEnvironment,
} from "../system/environment.js";
import {
  join,
  parent,
  resolve,
} from "../system/path.js";
import {
  chdir,
  exit,
  spawn,
} from "../system/process.js";
import { fileUrlToPath } from "../system/uri.js";

const root = resolve(parent(parent(fileUrlToPath(import.meta.url))));

chdir(root);

const args = rawArguments();

const values = await loadEnvironment(join(root, ".env"), { optional: true });
const environment = {
  ...processEnv,
  ...values,
};

if (args[0] === "push") {
  if (!values.GITHUB_TOKEN) {
    logError("Missing GITHUB_TOKEN for git push");
    exit(1);
  }

  Object.assign(environment, {
    GIT_CONFIG_COUNT: "1",
    GIT_CONFIG_KEY_0: "credential.helper",
    GIT_CONFIG_VALUE_0: '!f() { printf "username=x-access-token\\npassword=%s\\n" "$GITHUB_TOKEN"; }; f',
    GIT_TERMINAL_PROMPT: "0",
  });
}

const outcome = await debug(() => spawn("git", args, {
  cwd: root,
  env: environment,
}));

if (outcome.error || outcome.code !== 0) {
  logError(`git failed (exit ${outcome.code ?? 1})`);
  exit(outcome.code ?? 1);
}
