<h1>Contributing</h1>

<h3>Strict conventions</h3>

<table>
  <thead>
    <tr>
      <th>Rule</th>
      <th>Details</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Spelling</td>
      <td>
        <ul>
          <li>Always spell a word out in full, and never shorten it to an abbreviation, because a name has to be readable by someone who has not already memorised the local shorthand.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Identifiers</td>
      <td>
        <ul>
          <li>Always name a function or a variable in <code>snake_case</code>, separating the words of a multiword name with <code>_</code>.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Constants</td>
      <td>
        <ul>
          <li>Always name a module-level constant in <code>SCREAMING_SNAKE_CASE</code>, so that a value which is never reassigned is distinguishable from a variable at the place it is used, without the reader having to walk back to the declaration to find out.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Acronyms and proper nouns</td>
      <td>
        <ul>
          <li>Always write an acronym inside an identifier as one whole word, so <code>uuid_bytes</code> and <code>UUID_BYTES</code> rather than <code>UuidBytes</code> or <code>uuidBytes</code>, since a run of capitals stops marking where one word ended and the next began.</li>
          <li>Always keep the canonical casing of a proper noun or an acronym in prose and in a string value instead, so <code>OpenCode</code>, <code>HTTP</code>, and <code>UTC</code> rather than <code>opencode</code>, <code>Http</code>, and <code>Utc</code>, because these are names of things the project does not spell the way it spells its own identifiers.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Numbers</td>
      <td>
        <ul>
          <li>Always separate a number inside a name with <code>_</code> like any other word.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Directories</td>
      <td>
        <ul>
          <li>Always name a directory in lowercase <code>snake_case</code>.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Files</td>
      <td>
        <ul>
          <li>Always name a file in lowercase <code>snake_case</code> and separate a role suffix with <code>.</code>, so <code>users.model.js</code> is recognisable as the model of the <code>users</code> domain without the name having to be opened to find that out.</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

<h3>Formatting rules</h3>

<table>
  <thead>
    <tr>
      <th>Files</th>
      <th>Details</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>*</code></td>
      <td>
        <ul>
          <li>Always indent with 2 spaces, and never with a tab.</li>
          <li>Always end each line with the <code>LF</code> sequence, and never with <code>CRLF</code>.</li>
          <li>Always end the file with a newline character.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>*.js</code></td>
      <td>
        <ul>
          <li>Always name functions and variables in <code>snake_case</code>, following the <code>variable_1</code> pattern of the naming convention.</li>
          <li>Always accept a single options object parameter instead of positional arguments, never destructure it in the signature, and always default it to <code>{}</code> so that every function argument stays optional.</li>
          <li>Always document each module with a JSDoc block that starts with the <code>@module</code> tag and each function with its own JSDoc block, and never use the <code>@example</code> tag.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>*.json</code></td>
      <td>
        <ul>
          <li>Always expand arrays and objects across multiple lines and never collapse them onto a single line.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>*.md</code></td>
      <td>
        <ul>
          <li>Always write the content in HTML syntax and never in Markdown syntax, so a heading becomes a <code>&lt;h1&gt;</code> element, a list becomes a <code>&lt;ul&gt;</code> element, and a link becomes an <code>&lt;a&gt;</code> element, because a file then means the same thing whichever renderer reads it.</li>
          <li>Always leave the content of a comment exactly as its author wrote it and never rewrite the markup inside one, so that commented out content stays the text that was set aside rather than the text a later rule would have chosen.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>.gitignore</code></td>
      <td>
        <ul>
          <li>Always list the directory entries before the file entries, and always end a directory entry with <code>/</code> so a directory is never ignored by a bare name that could also match a file.</li>
          <li>Always keep each of those two groups in ascending order, compared without regard to case, in the same way as the project composition section in <code>README.md</code>, so that an entry in this file can be found by reading the two listings against each other instead of by memory.</li>
          <li>Always count a glob such as <code>*.log</code> as a file entry, since it names files rather than directories, and place it with the file entries.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>README.md</code></td>
      <td>
        <ul>
          <li>Always list the directories before the files in the project composition, and always end a directory name with <code>/</code>, so that a directory is never read as a file by its name alone.</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>
