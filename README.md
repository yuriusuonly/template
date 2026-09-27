<h1>Template</h1>

<a href="https://bun.com">
  <img alt="Bun" src="https://img.shields.io/badge/dynamic/json?url=https://github.com/yuriusuonly/template/raw/main/package.json&query=engines.bun&style=for-the-badge&logo=bun&logoColor=fbf0df&label=Bun&color=fbf0df"/>
</a>
<a href="https://opencode.ai">
  <img alt="OpenCode" src="https://img.shields.io/badge/dynamic/json?url=https://github.com/yuriusuonly/template/raw/main/package.json&query=devDependencies.opencode-ai&style=for-the-badge&logo=opencode&logoColor=cfcecc&label=OpenCode&color=cfcecc"/>
</a>
<a href="https://unlicense.org">
  <img alt="Unlicense" src="https://img.shields.io/badge/Unlicense-License-lightgray?style=for-the-badge&logo=unlicense&logoColor=white&color=lightgray"/>
</a>

<h2>Overview</h2>

<!--
<p></p>
-->

<p>
  This repository is a starting point for a JavaScript project that runs on <a href="https://bun.com">Bun</a> and is driven by <a href="https://opencode.ai">OpenCode</a>. It holds no application code yet. What it does hold is everything a new project is expected to inherit before its own code lands: the conventions that govern every file, the change log that records every change, the documentation you are reading, and the runtime configuration that decides which agent works here and which rules it works under.
</p>

<h3>Project composition</h3>

<!--
<pre>
./
├── node_modules/
├── .gitignore
└── README.md        # project documentation
</pre>
-->

<pre>
./
├── node_modules/          # installed dependencies
├── .gitignore             # ignored paths
├── AGENTS.md              # runtime instructions loaded by OpenCode
├── bun.lock               # pinned dependency versions
├── CHANGELOG.md           # dated record of every change
├── CONTRIBUTING.md        # conventions and formatting rules
├── LICENSE                # public domain dedication
├── opencode.json          # OpenCode runtime configuration
├── package.json           # package manifest and scripts
└── README.md              # project documentation
</pre>

<p>
  The tree lists the single directory before the files, and orders both groups ascending without regard to case, so that an entry can be found by reading the two listings against each other rather than from memory.
</p>

<h3>Setup requirements</h3>

<!--
<ol>
  <li></li>
</ol>
-->

<ol>
  <li>
    Install <a href="https://bun.com">Bun</a> in version <code>1.4.2</code> or newer, which is the lower bound the <code>engines.bun</code> field of <code>package.json</code> declares.
  </li>
  <li>
    Work on <code>Linux</code> or <code>macOS</code>, which are the two operating systems the <code>os</code> field of <code>package.json</code> declares.
  </li>
  <li>
    Keep network access available, so that the <code>opencode-ai</code> package and the platform binary it selects can be fetched from the registry during installation.
  </li>
</ol>

<h3>Usage instructions</h3>

<!--
<table>
  <thead>
    <tr>
      <th>Command</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code></code></td>
      <td></td>
    </tr>
  </tbody>
</table>
-->

<table>
  <thead>
    <tr>
      <th>Command</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>bun install</code></td>
      <td>
        Installs the dependencies declared in <code>package.json</code> and resolves them to the exact versions recorded in <code>bun.lock</code>, so that a later installation on another machine produces the same tree.
      </td>
    </tr>
    <tr>
      <td><code>bun run opencode</code></td>
      <td>
        Starts an <a href="https://opencode.ai">OpenCode</a> session in the project root. The runtime reads <code>opencode.json</code>, which loads <code>AGENTS.md</code> and selects the <code>0rchestrator</code> agent.
      </td>
    </tr>
  </tbody>
</table>

<h3>Runtime process</h3>

<!--
**Subheader**
...
-->

<p>
  A session begins by reading <code>opencode.json</code>, which is the single source of truth for how the project behaves. That file lists <code>AGENTS.md</code> under <code>instructions</code>, so every session starts with the runtime configuration in effect, and it names <code>0rchestrator</code> under <code>default_agent</code>, so the primary agent handles the work unless it hands a task to a subagent.
</p>

<p>
  The <code>0rchestrator</code> agent runs in the <code>primary</code> mode and carries the permission set the project works under. It may read, edit, search, list, run shell commands, delegate through tasks, ask questions, and reach the network on its own. It must ask first before it leaves the working directory, and it must ask first before it repeats an action the runtime flags as a loop.
</p>

<p>
  Two settings protect the work in progress. Snapshots are enabled, so the runtime can return a file to an earlier state after a failed edit. Compaction runs automatically and prunes the history it replaces, so a long session keeps its full meaning without holding on to every earlier exchange.
</p>

<p>
  Automatic updates notify rather than install, so a newer release of <a href="https://opencode.ai">OpenCode</a> is announced and never applied without a decision.
</p>

<p>
  Whatever the agent changes, the rules stay the same. Every new or edited file follows <code>CONTRIBUTING.md</code>, this document describes the project as it stands, every major change adds a row to <code>CHANGELOG.md</code>, and each such update is committed in the same step under a single line message.
</p>
