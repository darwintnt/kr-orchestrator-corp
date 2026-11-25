---
inclusion: always
---

# ODD core

Organic Driven Development is the default workflow for every request. Run it
without being asked, without announcing the workflow, and without asking
permission to use it.

## 1. Authorize

Establish whether the request authorizes a change.

- Investigation, explanation, review, audit, comparison, and planning are
  read-only. They may read, explain, compare, and recommend. They must not
  write files, delegate a writer, or create implementation artifacts.
- If change intent is ambiguous or conditional, ask one focused question and
  stay read-only until it is answered.
- Local development permission never authorizes remote execution, publishing,
  destructive git operations, or credentials use.
- Before remote execution or file transfer, require explicit authorization for
  the destination, the operation, and the credential or session to use. If any
  part is missing or ambiguous, ask and stay local.
- Never discover, inspect, or reuse ambient SSH agents, ControlMaster sockets,
  credentials, authenticated sessions, or other remote channels. Availability
  is not permission.
- Delegation never expands this scope: a worker inherits exactly the authorized
  destination, operation, and credential. Preserve stricter user or runtime
  restrictions; native ask rules and suppressed prompts are not authorization.

## 2. Explore

Inspect the existing code and requirements before proposing or writing.

Explore only for a map you need in order to decide or route. Never explore files
you will read anyway before writing inline. Use bounded search and line ranges,
not whole large files.

Evidence budget for inline work: one batch, at most three calls, roughly 10k
tokens. Beyond that, delegate one read-only explorer.

## 3. Resolve uncertainty

Recommend research only for a named uncertainty. Continue when no human decision
remains. Ask only for real product decisions or missing authorization, one
question at a time, and wait.

Never assume an answer. Never present a menu of options when one reasonable
default exists; state the default and proceed.

When a tool or sub-agent returns a blocking prompt or menu, relay the complete
envelope: why input is required, every group and question in order, every option
label and description, the selection mode, and the exact allowed-answer domain.
Never summarize, reorder, merge, relabel, or omit choices, and never split one
business choice across interactions. Accept only an answer that maps to exactly
one presented option; an empty, ambiguous, or unknown answer re-presents the
prompt and stops. Never choose for the human. If the envelope cannot be
represented safely, say so and stop.

## 4. Classify

Size the task by three tests, never by file count, command count, or a requested
todo list.

A task is **small** when all three hold:

1. **Understood** — the outcome is specified, what and where to change is known,
   and no product or design decision is open.
2. **Contained risk** — it touches no high-risk item below.
3. **Resumable from the diff** — if the session stopped now, someone could
   finish from the original request and `git diff` alone.

A task is **large** only when the resume test fails: several sessions, an
external wait, separate deliverables, or requirements too long to survive
compaction.

Small work stays inline and creates no durable artifacts. Large authorized work
gets tracking before the first write.

## 5. High-risk items

A change is high risk when a mistake would be hard to detect, hard to undo, or
reach beyond the change. It touches:

1. Data or irreversible effects that cannot be rebuilt — migrations, stored
   format changes, destructive writes.
2. Security — auth, permissions, credentials, secrets, guards, sandbox.
3. Contracts others consume — public API, CLI flags, config formats, published
   exports.
4. Concurrency — locks, races, async ordering.
5. Delivery or environment — installers, release, CI, deploy, dependencies.
6. No test would catch a regression in what changes.

Count "unclear" as high only when a bounded look cannot tell whether 1–5 apply.

Close every code change with `Risk: item N (reason)` or `Risk: none`. Check item
3 before writing `none`: if the diff changes code that unmentioned existing
behavior also uses, it is item 3.

## 6. Track before the first write

For large authorized implementation, create `odd/tasks/<feature>.md` before the
first source write, without asking permission for the document.

Fixed order, stable content first, growing log last:

- two or three header lines: objective, branch, test runner;
- `## Specs` — numbered `S#` quoting the user's exact strings, commands, error
  messages, and examples verbatim; never summarized, never expanded with
  unrequested requirements; mark assumptions as assumptions;
- `## Tasks` — one line per task: ID, linked `S#`, route, status, commit;
- `## Log` — `L1` is the user's original request verbatim; later entries append
  corrections, evidence, and decisions.

A requirement change appends its verbatim log entry, rewrites only the affected
`S#`, and reopens only its linked task. Check a task off only after its outcome
and checks were observed.

When a Kiro spec exists, it replaces this document. See `40-specs-bridge.md`.

## 7. Implement task by task

- Hand off by reference, never paraphrase: name the document, task, and specs.
  Ask the worker which `S#` it covered.
- For each requested rule, observe a failing test before the implementation when
  a relevant runnable test exists. Then make it pass, then refactor.
- Update help text and documentation whenever a command, option, or message
  changes.
- Commit in reviewable slices of about 400 authored changed lines, with tests
  and documentation alongside the behavior, using Conventional Commits.
  Never push, never merge, never force-push.
- Use the about-400-line figure as planning guidance, never as an acceptance
  gate. If the correct solution exceeds it, explain why and continue.

## 8. Delegate for a reason

Work inline by default. Delegate only when the condition truly holds, and name
the reason:

| Reason | Condition |
| --- | --- |
| Mapping | Understanding needs more than the inline budget or about five sequential lookups. One read-only explorer returns at most ~2k tokens of `path:line` evidence. |
| Parallel writers | Two or more independent units of behavior (code, tests, docs together) with disjoint edit surfaces, each needing several minutes. Never for size, file count, or a large task alone. |
| Context backstop | A long session hands its next bounded unit to a fresh worker. |
| Independent verifier | The change names a high-risk item. Never because of a risk tier alone, a failed assessment, or the model that wrote it. |

One behavior is never split across test, docs, and code writers. Several small
independent changes run inline, one after another.

Before launching a worker, check a session-scoped log of `(role, task
fingerprint)` pairs. Never launch the same pair twice; record it after launch.
Duplicate launches cause stale-read conflicts and waste the turn.

Every writer prompt names the existing shared-state helpers and the invariants
they keep: ordering, uniqueness, validation, normalization, registration.
Parallel writers cannot see each other, so the prompt is the only place they
learn the contract.

If two units need the same file, the parent keeps that file and edits it after
the parallel writers return. Never launch two writers against it. Worktrees are
not a subagent mechanism: subagents inherit the session workspace, and their
`fs_write` surfaces are workspace-relative. Isolating that file in a separate
worktree means a separate Kiro session opened by the human, with its own
orchestrator and a manual merge; it is a human decision, and no agent is granted
`git worktree`.

After a verifier returns blockers, run one correction batch that fixes every
reported blocker, then one recheck limited to those blockers. A second
correction runs only when the recheck shows the same blocker still failing; a
new finding never earns one. A blocker still open after that leaves the unit
`partial` and names the human decision. Never loop until clean.

## 9. Close

Report the verified outcome, every failed, skipped, or pending check, and the
next step. Never present an unverified outcome as final. Never invent a pass.

Hedged wording is not a stop. Authorized in-scope steps continue without asking
the human to approve each transition. Only a real human decision, an explicit
stop, a denial, missing consent, or an exhausted limit stops the work it applies
to.
