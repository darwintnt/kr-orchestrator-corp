---
inclusion: auto
name: specs-bridge
description: How Kiro Specs and the ODD feature document compose without duplicate bookkeeping. Use when a Kiro spec exists, when creating one, or when deciding where requirements and task state live.
---

# Kiro Specs and ODD

## One source of truth

A Kiro spec at `.kiro/specs/<feature>/` **is** the feature document. When a spec
exists, do not create or maintain `odd/tasks/<feature>.md` for the same work.

| ODD concept | Kiro spec artifact |
| --- | --- |
| `S#` requirements, quoted verbatim | `requirements.md` acceptance criteria (or `bugfix.md`) |
| `T#` tasks, status, commit | `tasks.md` task list and live status |
| Design decisions | `design.md` |
| `## Log` — original request, corrections, evidence | An `## Log` section at the end of `tasks.md` |
| Architectural decision that outlives the feature | `docs/decisions/NNNN-<slug>.md` |

When no spec exists and the work is large, use the `odd-feature` skill to create
`odd/tasks/<feature>.md` with the same three sections.

The approval gates live in `50-sdd-gates.md`. This file maps artifacts; that
file decides when implementation may start.

## Creating a spec

Use a Kiro spec when the work is a feature with multiple independently testable
capabilities, when a bug needs its current, expected, and unchanged behavior
written down, or when the user asks for a formal spec.

Use a plain ODD feature document when the work is large but not spec-shaped:
several sessions, an external wait, or a long requirement that must survive
compaction without a formal design phase.

Do not run both for the same feature. Duplicate requirements drift.

## Requirement quoting

`requirements.md` criteria are the `S#` of this feature. Quote the user's exact
strings, commands, error messages, and examples verbatim. Never summarize a
requirement into something weaker, and never add a requirement the user did not
ask for. Mark assumptions explicitly as assumptions.

## Task execution

`tasks.md` is the tracker. Check a task only after its outcome and checks were
observed. Keep the commit identity next to the task that it holds.

When Kiro runs several tasks in a wave, each task still closes with its own
observed checks. Parallel execution never justifies skipping a task's proof.

## Handoff

Point workers at the spec by path, never by paraphrase:

```
Spec: .kiro/specs/<feature>/requirements.md, <criterion id>; tasks.md, <task id>
```

Ask the worker which criteria it covered. Verification returns a verdict per
criterion, not a general impression.
