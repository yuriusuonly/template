<h1>Changelog</h1>

<!--
<h3>yyyy-mm-dd hh:mm:ss UTC±00:00</h3>

<ul>
  <li></li>
</ul>
-->

<h3>2026-09-27 14:31:42 UTC±00:00</h3>

<ul>
  <li>Published the initial project documentation, covering the overview, the project composition, the setup requirements, the usage instructions, and the runtime process.</li>
  <li>Added the <code>package.json</code> manifest declaring the project as private, pinning the supported <a href="https://bun.com">Bun</a> version and the supported operating systems, and exposing the <code>opencode</code> script.</li>
  <li>Added <code>bun.lock</code> to pin the exact dependency versions and the platform binary that <code>opencode-ai</code> resolves to.</li>
  <li>Added the <code>opencode.json</code> runtime configuration, which loads <code>AGENTS.md</code> as its instructions, selects the <code>0rchestrator</code> agent by default, allows the update notification, the snapshots, and the automatic compaction with pruning, and sets the permission set the primary agent works under.</li>
  <li>Added <code>AGENTS.md</code> to carry the runtime instructions and the mandatory documentation rules for the project.</li>
  <li>Added <code>CONTRIBUTING.md</code> to record the naming, spelling, and formatting conventions that every new or edited file follows.</li>
  <li>Added the <code>LICENSE</code> file dedicating the project to the public domain.</li>
  <li>Added the <code>.gitignore</code> file listing the dependency directory before the file entries.</li>
</ul>
