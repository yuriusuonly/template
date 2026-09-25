# Template

[![Bun](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fyuriusuonly%2Ftemplate%2Fraw%2Fmain%2Fpackage.json&query=engines.bun&style=for-the-badge&logo=Bun&logoColor=fbf0df&label=Bun&color=fbf0df)](https://bun.com)
[![OpenCode](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2Fyuriusuonly%2Ftemplate%2Fraw%2Fmain%2Fpackage.json&query=devDependencies.opencode-ai&style=for-the-badge&logo=opencode&logoColor=cfcecc&label=OpenCode&color=cfcecc)](https://opencode.ai)
[![MIT](https://img.shields.io/badge/MIT-License-lightgray?style=for-the-badge&&color=lightgray)](https://opensource.org/license/MIT)

## Overview

<p>
  This configuration-only Bun repository provides the OpenCode runtime configuration, agent instructions, and project documentation without an application build.
</p>

### Project composition

<pre>
./
├── node_modules/    # installed dependencies; directories end with /
├── .gitignore       # ignores generated and local files
├── AGENTS.md        # OpenCode agent instructions
├── bun.lock         # pinned dependency versions
├── CHANGELOG.md     # major change timeline
├── CONTRIBUTING.md  # contribution and formatting rules
├── LICENSE          # MIT license text
├── opencode.json    # OpenCode runtime configuration
├── package.json     # package metadata and scripts
└── README.md        # project documentation
</pre>

### Setup requirements

<ol>
  <li>Install Bun 1.4.2 or newer on Linux or macOS.</li>
  <li>Run <code>bun install</code> from the repository root to install the pinned <code>opencode-ai</code> dependency.</li>
</ol>

### Usage instructions

<table>
  <thead>
    <tr>
      <th>Command</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>bun run opencode</code></td>
      <td>Start OpenCode with the Bun runtime.</td>
    </tr>
  </tbody>
</table>

### System architecture

<ul>
  <li><code>package.json</code> defines the private Bun package and the <code>opencode-ai</code> development dependency.</li>
  <li><code>bun.lock</code> pins dependency versions for reproducible installs.</li>
  <li><code>opencode.json</code> configures the <code>0rchestrator</code> agent, snapshots, and compaction.</li>
  <li><code>AGENTS.md</code> is loaded through the OpenCode <code>instructions</code> setting.</li>
  <li><code>CONTRIBUTING.md</code> and <code>CHANGELOG.md</code> document contribution rules and major changes.</li>
  <li><code>node_modules/</code> contains locally installed dependencies and is ignored by Git.</li>
</ul>
