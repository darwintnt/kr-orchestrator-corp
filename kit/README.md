# Kiro discipline kit

A workspace-scoped port of the parts of Gentle AI that matter, for teams whose machines only allow Kiro IDE and Kiro CLI.

It is not a plugin, not a dependency, and not a service. It is a set of files you commit, or copy to your user profile: steering rules, four subagents, three optional hooks, twelve skills, and a memory convention. Review the workspace copy in a pull request like any other code.

**It installs nothing.** No package manager, no admin rights, no runtime. Kiro is already on the machine; everything here is text inside the repository.

**Español:** [README.es.md](README.es.md) — guía paso a paso (Windows 11 corporativo, con sección macOS/Linux).

That claim is validated, not assumed: see [ZERO-INSTALL.md](ZERO-INSTALL.md) for the upstream inventory, the eight Kiro agent assets, and a skill-by-skill verdict on what copies cleanly and what cannot leave the binary.

## The SDD question, answered honestly

You asked to keep SDD alongside ODD. There is nothing left upstream to keep: since gentle-ai v4.0.0, SDD is retired in favor of ODD. The official documentation (`docs/kiro.md` in the repository) states that gentle-ai no longer installs `sdd-*` Kiro agents and no longer routes work through `.kiro/specs/`, and that a `gentle-ai sync` deletes the `sdd-*` agent files earlier releases wrote into `~/.kiro/agents/` when their content matches a known release. The repository still carries `internal/components/legacyassets/sdd_*` plus the `odd/tasks/remove-sdd-odd-only-main.md` and `sdd-retirement-followups.md` records; those exist to clean old installs, not to run a workflow.

What SDD actually gave you was formality: requirements, design, tasks, approval gates. That formality still exists in Kiro, natively and better supported than any agent port: Kiro Specs. So this kit does not resurrect SDD. It packs ODD and adds a bridge that makes a Kiro spec the feature document ODD works from (`40-specs-bridge.md`). You keep the discipline; you stop maintaining a second, unofficial spec system. If you want the gates enforced rather than suggested, `50-sdd-gates.md` loads always and blocks implementation until requirements and design carry an approved `## Approval` block and every task cites an acceptance criterion. It is steering, not a cryptographic gate; the human owns approval.

## What the official integration already gives you

gentle-ai supports Kiro IDE as a first-class target (`kiro-ide`, full tier). A global `gentle-ai install` writes:

- `~/.kiro/steering/gentle-ai.md`, the orchestrator, `inclusion: always`
- `~/.kiro/skills/`, the installed skills
- `~/.kiro/agents/`, the agent assets: the Judgment Day trio (`jd-judge-a`, `jd-judge-b`, `jd-fix-agent`) and the five `review-*` lens agents used by native review
- `~/.kiro/settings/mcp.json`, the MCP servers

Two consequences for this kit: it is workspace-scoped (`.kiro/` inside the repository, not `~/.kiro/`), so it is portable and reviewable; and it adds the role agents the official install does not ship: `explorer`, `writer`, `verifier`, and an `orchestrator` that ties them together.

If your team can run the official installer, do that first and use this kit for the gap. If it cannot, this kit stands alone.

## Mapping

| Gentle AI | Here | Notes |
| --- | --- | --- |
| ODD protocol | `.kiro/steering/00-odd-core.md` | always included |
| Persona and output contract | `.kiro/steering/10-artifacts-and-commits.md` | language and commit rules |
| TDD policy | `.kiro/steering/20-testing.md` | `fileMatch`, loads on test files |
| Engram memory | `.kiro/steering/30-memory.md`, `MEMORY.md`, `docs/decisions/` | the repository is the memory |
| SDD | retired upstream | replaced by Kiro Specs plus `40-specs-bridge.md` |
| SDD approval gates | `.kiro/steering/50-sdd-gates.md` | always; strict mode, human-owned approvals |
| Explorer subagent | `.kiro/agents/explorer.md` | read-only |
| Writer subagent | `.kiro/agents/writer.md` | edit surface enforced by permissions |
| Verifier subagent | `.kiro/agents/verifier.md` | read-only, verdict per S# |
| Orchestrator | `.kiro/agents/orchestrator.md` | select it as the session agent; it delegates to the other three |
| RDD native review | `.kiro/skills/judgment-day/SKILL.md` | discipline, not cryptographic authority |
| Feature document | `.kiro/skills/odd-feature/SKILL.md` | only when there is no Kiro spec |
| Hooks and gates | `.kiro/hooks/` and `.kiro/bin/` | optional; the only part that spawns processes |
| Work-unit commits | steering, section 7 | conventional, no AI attribution |
| Upstream skills | `.kiro/skills/` | nine copied verbatim; see `THIRD-PARTY-NOTICES.md` |

## Bundled skills

Three written for Kiro:

- `odd-feature` — the feature document, for large work that is not a Kiro spec
- `verification` — verdict per `S#`, with observed evidence
- `judgment-day` — dual blind review in two rounds, no delivery authority

Nine copied from upstream, unchanged: `branch-pr`, `chained-pr`, `cognitive-doc-design`, `comment-writer`, `go-testing`, `skill-creator`, `skill-improver`, `systemic-issue-triage`, `work-unit-commits`. They are guidance only; none needs the binary, and `go-testing` stays inert on an image without Go.


## Install

The kit supports two scopes, and they can coexist. Kiro merges steering and skills across scopes; for custom agents with the same name, the project agent wins with a warning.

| | Workspace | Global |
| --- | --- | --- |
| Location | `<repo>/.kiro/` | `%USERPROFILE%\.kiro\` on Windows, `~/.kiro/` elsewhere |
| Applies to | one repository | every repository on the machine |
| Reviewed in a pull request | yes | no |
| Shared with the team | yes | no, it is personal |
| Memory and ADRs | included | stay project-scoped |

Use workspace scope when the team should inherit the rules or security has to review them. Use global scope for personal productivity across many repositories. A global baseline plus a workspace copy for the repo you care about is a valid setup.

**Corporate warning:** the global install writes to your user profile, outside the repository. If your company manages `%USERPROFILE%\.kiro` with MDM or Group Policy, or restricts writes outside the repository, use workspace scope. Do not overwrite a managed steering directory.

### Workspace install

From the repository root.

macOS or Linux:

```sh
cp -R kit/.kiro .
cp kit/AGENTS.md kit/MEMORY.md kit/THIRD-PARTY-NOTICES.md .
cp -R kit/licenses .
mkdir -p docs/decisions
cp kit/docs/decisions/README.md kit/docs/decisions/0000-template.md docs/decisions/
```

Windows 11, PowerShell 5.1, no installs required:

```powershell
New-Item -ItemType Directory -Force .\.kiro | Out-Null
Copy-Item -Recurse -Force .\kit\.kiro\* .\.kiro\
Copy-Item -Force .\kit\.kiro\.gitattributes .\.kiro\
Copy-Item .\kit\AGENTS.md, .\kit\MEMORY.md, .\kit\THIRD-PARTY-NOTICES.md .
Copy-Item -Recurse -Force .\kit\licenses .
New-Item -ItemType Directory -Force .\docs\decisions | Out-Null
Copy-Item .\kit\docs\decisions\README.md, .\kit\docs\decisions\0000-template.md .\docs\decisions\
```

Explorer works too: drag `.kiro`, `licenses`, `AGENTS.md`, `MEMORY.md`, `THIRD-PARTY-NOTICES.md`, and the two files from `kit\docs\decisions\` into `docs\decisions\`.

Do not skip `THIRD-PARTY-NOTICES.md` and `licenses/`: nine of the skills are upstream copies under Apache-2.0, and the notice is what keeps that use clean inside a company repository. Do not skip `.kiro/.gitattributes` either: it keeps the hook scripts and the structured text at LF across checkouts.

Then:

1. Delete what you do not want. Nothing here is mandatory.
2. Adapt the edit surfaces (next sections). This is the step people skip and then blame the agent.
3. Commit. The kit becomes part of the repository and appears in every pull request diff.
4. Open Kiro, start a session, confirm the steering files loaded and `/odd-feature` is listed.

`kit/README.md` is documentation for the humans adopting the kit. Do not copy it into the repository root unless you want it there.

### Global install

Global scope puts the rules, the entry point, the twelve skills, and the four agents in your user profile, so they apply to every repository on the machine. It writes outside the repository; use workspace scope if that is not allowed.

If `KIRO_HOME` is set, Kiro uses that directory instead of `%USERPROFILE%\.kiro`. Check it before running the block, and point `$k` at it:

```powershell
$env:KIRO_HOME
```

If it prints a path, replace `$k = "$env:USERPROFILE\.kiro"` with `$k = $env:KIRO_HOME`. Prefer a `KIRO_HOME` path without spaces: a raw space in a `file://` URI is not portable.

Windows 11, PowerShell 5.1:

```powershell
$k = "$env:USERPROFILE\.kiro"

# 0. Back up the parts the kit will touch
$stamp = Get-Date -Format yyyyMMdd-HHmm
$backup = "$env:USERPROFILE\.kiro.backup-$stamp"
New-Item -ItemType Directory -Force $backup | Out-Null
foreach ($d in "steering","agents","skills") {
  if (Test-Path "$k\$d") { Copy-Item -Recurse -Force "$k\$d" $backup }
}

# 1. Steering and the global entry point
New-Item -ItemType Directory -Force "$k\steering","$k\agents","$k\skills" | Out-Null
Copy-Item -Force .\kit\.kiro\steering\*.md "$k\steering\"
Copy-Item -Force .\kit\AGENTS.md "$k\steering\AGENTS.md"

# 2. Skills: refuse to merge over same-named skills
$collisions = Get-ChildItem .\kit\.kiro\skills -Directory |
  Where-Object { Test-Path (Join-Path "$k\skills" $_.Name) }
if ($collisions) {
  $collisions.Name
  throw "Those skill names already exist under $k\skills. Back them up, remove them, then rerun."
}
Copy-Item -Recurse -Force .\kit\.kiro\skills\* "$k\skills\"

# 3. Agents
Copy-Item -Force .\kit\.kiro\agents\*.md "$k\agents\"

# 4. Point the global agents at the global steering and skills
$abs = ($k -replace '\\','/')
foreach ($name in "orchestrator","explorer","writer","verifier") {
  $p = "$k\agents\$name.md"
  if (-not (Test-Path $p)) { continue }
  $t = [System.IO.File]::ReadAllText($p)
  $t = $t.Replace('file://.kiro/steering/**/*.md', "file:///$abs/steering/**/*.md")
  $t = $t.Replace('skill://.kiro/skills/*/SKILL.md', 'skill://~/.kiro/skills/*/SKILL.md')
  [System.IO.File]::WriteAllText($p, $t, [System.Text.UTF8Encoding]::new($false))
}

# 5. Licenses for the nine upstream skills
Copy-Item -Force .\kit\THIRD-PARTY-NOTICES.md "$k\THIRD-PARTY-NOTICES.md"
New-Item -ItemType Directory -Force "$k\licenses" | Out-Null
Copy-Item -Force .\kit\licenses\* "$k\licenses\"
```

Why step 4 exists: a workspace agent resolves `file://.kiro/steering/...` against the repository. A global agent must name the global directory, and `file://` does not document `~` expansion, so the block writes the absolute path. `skill://` does document home expansion, so that line uses `~`. The write is BOM-less UTF-8 on purpose; a BOM can break the YAML frontmatter.

macOS or Linux, same procedure as the Windows block:

```sh
k="${KIRO_HOME:-$HOME/.kiro}"

# 0. Back up the parts the kit will touch
stamp=$(date +%Y%m%d-%H%M)
backup="$k.backup-$stamp"
mkdir -p "$backup"
for d in steering agents skills; do
  [ -d "$k/$d" ] && cp -R "$k/$d" "$backup/"
done

# 1. Steering and the global entry point
mkdir -p "$k/steering" "$k/agents" "$k/skills"
cp kit/.kiro/steering/*.md "$k/steering/"
cp kit/AGENTS.md "$k/steering/AGENTS.md"

# 2. Skills: refuse to merge over same-named skills
collisions=""
for d in kit/.kiro/skills/*/; do
  name=$(basename "$d")
  [ -e "$k/skills/$name" ] && collisions="$collisions $name"
done
if [ -n "$collisions" ]; then
  echo "collision:$collisions"
  echo "Back them up, remove them, then rerun."
else
  cp -R kit/.kiro/skills/* "$k/skills/"
fi

# 3. Agents
cp kit/.kiro/agents/*.md "$k/agents/"

# 4. Point the global agents at the global resources
for name in orchestrator explorer writer verifier; do
  f="$k/agents/$name.md"
  [ -f "$f" ] || continue
  sed -i.bak \
    -e "s|file://\.kiro/steering/\*\*/\*\.md|file://$k/steering/**/*.md|" \
    -e "s|skill://\.kiro/skills/\*/\SKILL\.md|skill://~/.kiro/skills/*/SKILL.md|" \
    "$f"
  rm -f "$f.bak"
done

# 5. Licenses
cp kit/THIRD-PARTY-NOTICES.md "$k/THIRD-PARTY-NOTICES.md"
mkdir -p "$k/licenses"
cp kit/licenses/* "$k/licenses/"
```

What stays project-scoped, in both modes:

- `MEMORY.md`, because memory is project state, not personal configuration;
- `docs/decisions/`, because ADRs live with the code they explain;
- `.kiro/specs/`, because a spec belongs to one feature in one repository;
- the hooks, because they would fire in every workspace and a global hook command runs with the project as cwd, so it needs an absolute script path. The kit keeps hooks project-scoped and optional.

What to expect:

- Precedence: a project agent with the same name wins over the global one, with a warning; skills merge and workspace wins on name; steering merges and workspace wins on conflicts.
- The global agent surfaces apply everywhere. That is the point, but a `writer` allowed to edit `src/**` in every repository is broader than a reviewed per-repo file. If that is too much, install only steering, `AGENTS.md`, and skills globally, and keep the agents workspace-scoped.
- If you already had global agents named `orchestrator`, `explorer`, `writer`, or `verifier`, step 3 overwrites them; the backup from step 0 keeps the originals.
- If the official gentle-ai install already wrote `~/.kiro/steering/gentle-ai.md` or same-named skills, do not run two always-on ODD steerings. Step 0 backs them up; choose one source of truth.

Verify the copy:

```powershell
$k = "$env:USERPROFILE\.kiro"
Get-ChildItem "$k\steering" | Select-Object Name
(Get-ChildItem "$k\skills" -Directory).Count
Select-String "file://|skill://" "$k\agents\*.md"
```

The count must include the kit's twelve skill folders; it can be higher if you already had others. The agent resources must name `file:///C:/Users/<you>/.kiro/steering/**/*.md` and `skill://~/.kiro/skills/*/SKILL.md`. Then open Kiro, run `/config` to confirm steering and skills, select `orchestrator` in a repository without its own `.kiro`, and ask which rules it has.

For macOS or Linux, use the POSIX checks in the platform section below.

Uninstall, removing only the names the kit installed:

```powershell
$k = "$env:USERPROFILE\.kiro"
'00-odd-core','10-artifacts-and-commits','20-testing','30-memory','40-specs-bridge','50-sdd-gates','AGENTS' |
  ForEach-Object { Remove-Item "$k\steering\$_.md" -Force -ErrorAction SilentlyContinue }
'orchestrator','explorer','writer','verifier' |
  ForEach-Object { Remove-Item "$k\agents\$_.md" -Force -ErrorAction SilentlyContinue }
'branch-pr','chained-pr','cognitive-doc-design','comment-writer','go-testing','judgment-day',
'odd-feature','skill-creator','skill-improver','systemic-issue-triage','verification','work-unit-commits' |
  ForEach-Object { Remove-Item -Recurse -Force "$k\skills\$_" -ErrorAction SilentlyContinue }
Remove-Item "$k\THIRD-PARTY-NOTICES.md" -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$k\licenses" -ErrorAction SilentlyContinue
```

If any of those skill names already existed before the install, restore the backup instead of deleting them. On macOS or Linux, use the POSIX uninstall in the platform section below.

## Locked-down Windows 11: no installs, monitored endpoint

This is the profile the kit was validated against, so it is worth being precise about what survives and what does not.

What works with zero permissions, zero installs, and zero extra processes:

- the six steering files, which Kiro loads by inclusion mode;
- the four custom agents and their `permissions` rules, enforced by the Kiro runtime;
- the twelve skills, including `/odd-feature`, `/judgment-day`, and the nine copied from upstream;
- `MEMORY.md`, `docs/decisions/`, and the whole commit and review discipline.

Kiro already provides every runtime these need. Nothing is downloaded, nothing calls home, nothing executes on its own.

What to omit: `.kiro\hooks\` and `.kiro\bin\`. They are the only part that spawns processes, and a hook firing at every turn start and stop is exactly the kind of automation an EDR or monitoring agent records. That is not a reason to hide it; it is a reason to not add it without your security team's answer.

```powershell
Remove-Item -Recurse -Force .kiro\hooks, .kiro\bin
```

You lose one convenience: the automatic context print at session start. You do not lose the behavior, because `AGENTS.md` step 1 tells the agent to read `MEMORY.md` itself, and `30-memory.md` repeats the rule. The hooks were a convenience over a rule that already exists.

Toolchain: this profile assumes `git` and `npm` on PATH, which the corporate image ships. The agents allow only git reads plus `npm test`, `npm run`, and `npm ls`; the Go, Python, and Rust entries are gone. The orchestrator additionally gets `git add`, `git switch`, and `git branch`, because it owns commits. The Node hook probes `go`, `npm`, `python3`/`python`/`py -3`, and `cargo` before use, so a missing toolchain reports itself instead of crashing.

Two deliberate omissions in the agent surfaces:

- `npm install`, `npm i`, and `npm ci` are refused. Adding or updating a dependency is a human decision and a supply-chain event on a monitored endpoint, not something an agent does while implementing a unit.
- `npx` is refused even where it is available. `npm run` executes only scripts declared in `package.json`, which a reviewer sees in the diff; `npx` downloads and runs arbitrary code from the registry. If your team has standardized specific `npx` tools, add those exact names to the allow lists, never `npx *`.

Encoding: the hook scripts are ASCII and LF; `.gitattributes` keeps them that way across checkouts.

## Adapt the edit surfaces first

`writer.md` ships with generic globs: `src/**`, `tests/**`, `test/**`, `docs/**`, `odd/**`, `MEMORY.md`. If your project keeps code in `app/`, `packages/`, `internal/`, or `cmd/`, the writer will refuse to write and will report the path. That is the design working, since it stops instead of widening its own surface, but it wastes a turn when the globs are wrong.

Edit `permissions.rules` in `.kiro/agents/writer.md` and the matching block in `.kiro/agents/orchestrator.md`: keep the `fs_write` allow list equal to the directories where source and tests actually live, and leave the deny list (`.kiro/**` and `**/.kiro/**` for the global config, `.git/**`, `.env*`, keys, secrets) untouched. Do the same review for `verifier.md` and `explorer.md`, whose shell allow lists name specific test runners.

For a global install, the same blocks live in `%USERPROFILE%\.kiro\agents\`; edit them there as well if the global surfaces should match your repository layout.

## Hooks on every platform

The hooks are optional. On a managed machine, decide with IT whether they exist at all.

The three JSON files call `node`, the same command on Windows, macOS, and Linux. There is no per-OS swap and no execution-policy step. Node ships with npm on the corporate image; check it with `node --version`. If Node is not available, delete the hooks; the core rules, agents, skills, memory, and ADRs do not need it.

Keep `matcher` and `timeout` as they are. If you keep only one hook, keep `session-start`; `stop-checks` runs a full test suite on every turn end, which is heavy and very visible.

## macOS and Linux

The hooks are Node, so there is no OS-specific hook setup: the same `.kiro/hooks/*.json` works on Windows, macOS, and Linux. Node ships with npm; check `node --version`. If a machine has no Node, delete the hooks; everything else works without them.

- Keep `.kiro/.gitattributes`: it keeps the hook scripts and the structured text at LF across checkouts, which avoids noisy diffs.
- The global install uses the POSIX block above. `KIRO_HOME` works the same way.
- The agents' shell allow lists default to `npm` and `git`. If the project uses Go, Python, or Rust, add the exact runner (`go test *`, `python3 -m pytest *`, `cargo test *`) to `verifier.md` and `explorer.md`; the Node hook already probes those toolchains.

Verify a global copy:

```sh
k="${KIRO_HOME:-$HOME/.kiro}"
ls "$k/steering"
ls -1 "$k/skills" | wc -l
grep -nE "file://|skill://" "$k/agents/"*.md
```

Uninstall a global copy:

```sh
k="${KIRO_HOME:-$HOME/.kiro}"
for f in 00-odd-core 10-artifacts-and-commits 20-testing 30-memory 40-specs-bridge 50-sdd-gates AGENTS; do
  rm -f "$k/steering/$f.md"
done
for f in orchestrator explorer writer verifier; do
  rm -f "$k/agents/$f.md"
done
for s in branch-pr chained-pr cognitive-doc-design comment-writer go-testing judgment-day \
  odd-feature skill-creator skill-improver systemic-issue-triage verification work-unit-commits; do
  rm -rf "$k/skills/$s"
done
rm -f "$k/THIRD-PARTY-NOTICES.md"
rm -rf "$k/licenses"
```

If any of those skill names existed before the install, restore the backup instead.

Because every hook calls `node`, the same committed hook works on Windows, macOS, and Linux. Node is the only requirement; a machine without it should delete the hooks or run without them. The kit no longer ships OS-specific hook variants.

## Enforcement model

Be clear about what actually blocks and what merely talks.

- `permissions.rules` block. Kiro evaluates them with deny-overrides; file writes and shell commands outside the surface are refused by the runtime, not by the model's goodwill.
- Hooks observe. `warn-destructive-shell.js` prints a warning to stderr and exits 0 on purpose: it writes no log, so no secret can leak into one. Turning `exit 0` into `exit 2` may or may not abort the tool call depending on your Kiro version. Test it before relying on it, and do not assume.
- Steering and skills persuade. They shape behavior on every turn, but a model that ignores them is not stopped by them.

That is the honest split. Everything load-bearing is in `permissions`, and it needs no process, no script, and no install.

## What does not port

- **RDD's review authority.** Gentle AI's native review freezes an immutable candidate, selects lenses, keeps cryptographic receipts, and gates on exact acknowledgements. Kiro has no equivalent. `judgment-day/SKILL.md` reproduces the discipline, meaning freeze the candidate, blind dual review, bounded correction, honest survivors, and says in its own text that it is discipline, not authority.
- **Engram.** Replaced, not emulated. `MEMORY.md`, ADRs, and the session-start read cover what an external memory service covered, and they are reviewable.
- **Output styles and slash commands.** Kiro does not support them as gentle-ai features. Skills with the same name fill the slash-command gap where possible.

## Requirements

- Kiro IDE 1.0+ or Kiro CLI V3. Steering `inclusion: auto`, `permissions`, and the standalone hook JSON format are V3-era features.
- CLI 2.x: profiles that declare `allowedTools` without `permissions` are skipped by V3 until `/upgrade-agent`. Run `kiro-cli --version`; if it is below V3, migrate first.
- Windows needs nothing beyond Node on PATH, and only if you keep the hooks. The copy commands use PowerShell 5.1.
- macOS and Linux need `git` for session context; the hooks need `node`. The steering, agents, skills, memory, and ADRs need no runtime.
- Custom agents here declare `resources` explicitly. The documentation contradicts itself on whether custom agents inherit steering, so the kit never depends on inheritance.

## Verify after copying

Windows, with PowerShell:

```powershell
Get-ChildItem .kiro/hooks/*.json -ErrorAction SilentlyContinue | ForEach-Object {
  try { Get-Content $_ -Raw -ErrorAction Stop | ConvertFrom-Json | Out-Null; "ok  $($_.Name)" }
  catch { "BAD $($_.Name)" }
}
Get-ChildItem .kiro/bin/*.js -ErrorAction SilentlyContinue | ForEach-Object {
  node --check $_.FullName
  if ($LASTEXITCODE -ne 0) { "BAD $($_.Name)" }
}
Get-Content .kiro/agents/*.md -TotalCount 1
Get-Content .kiro/skills/*/SKILL.md -TotalCount 1
```

macOS or Linux:

```sh
for f in .kiro/hooks/*.json; do python3 -m json.tool "$f" > /dev/null || echo "BAD $f"; done
for f in .kiro/bin/*.js; do node --check "$f" || echo "BAD $f"; done
git check-attr eol -- .kiro/bin/session-context.js
```

The last command must print `eol: lf`.

Then in Kiro: the steering files appear as loaded, `/odd-feature` and `/judgment-day` are invocable, and a test session writing to a path outside the surface is refused by `writer`.

Delegation check: select `orchestrator` and ask it to map a module read-only. Kiro asks for confirmation the first time it starts a sub-agent, because the kit does not grant a blanket `subagent` allow rule; approving is the point, since it keeps each delegation visible. If Kiro reports that the agent cannot delegate at all, add `subagent` to `tools` in `orchestrator.md` next to the three `subagent/<name>` entries. The documentation describes both forms, and with only these four agents in the workspace the reachable set does not change.

Do not add `@builtin` or `*` to that `tools` list: both include the generic sub-agent tool, which can start any agent and would undo the restriction.

## Corporate note

This kit contains no company data, no credentials, no telemetry, and talks to no external service. It is plain text you commit. That is deliberate: it is the version of this workflow most likely to survive a security review, because a reviewer can read every line of it in the pull request that adds it, and because the parts that execute are optional and few.
