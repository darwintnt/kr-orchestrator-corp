---
name: odd-feature
description: Create and maintain an ODD feature document when the work is large and no Kiro spec exists. Use when starting a multi-session change, resuming one, or recording task status and evidence.
---

# ODD feature document

Use this when the work is large (it fails the resume test) and no Kiro spec
exists. If `.kiro/specs/<feature>/` exists, that spec is the document; do not
create this one.

## Location and identity

`odd/tasks/<feature-name>.md`, one file per feature, descriptive and
filename-safe. Never overwrite another feature.

## Fixed structure

Keep this order. Stable content first, growing log last.

```markdown
# <Feature name>

Objective: <one line>. Branch: <branch>. Runner: <test command>.

## Specs

- S1: <requirement, quoting the user's exact strings, commands, error messages,
  and examples verbatim. Never summarize. Mark assumptions as assumptions.>
- S2: ...

## Tasks

- T1 — S1 — route: inline — status: open — commit: -
- T2 — S2 — route: delegated/writer — status: open — commit: -

## Log

- L1 (user, verbatim): <the original request, exactly as written>
- L2 (decision): <what changed and why, one line>
- L3 (evidence): <command: observed result>
```

## Rules

1. Create the document before the first source write, without asking permission
   for the document itself.
2. Quote verbatim. A requirement that loses its exact wording becomes a weaker
   requirement.
3. Never add a requirement the user did not ask for. If a requirement is
   inferred, label it `assumption:`.
4. A requirement change appends its verbatim log entry, rewrites only the
   affected `S#`, and reopens only its linked task.
5. Check a task only after its outcome and checks were observed. Record the
   commit identity that holds it.
6. Hand off by reference: `Spec: odd/tasks/<feature>.md, T2, S3-S4`. Ask the
   worker which `S#` it covered.
7. Keep the log short. Evidence lives as `<command>: <observed result>`, not as
   an essay.

## Close

Report the verified outcome, every failed, skipped, or pending check, and the
next step. Never present an unverified outcome as final.
