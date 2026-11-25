---
inclusion: always
---

# Project memory

There is no external memory service. The repository is the memory.

## Session start

Read `MEMORY.md` before your first action. The `SessionStart` hook prints the
current git state, recent commits, the tail of `MEMORY.md`, and the decision
index. Use that output to rehydrate; do not re-derive what is already recorded.

## During work

Record durable knowledge where it belongs:

- **Architecture or product decision** → `docs/decisions/NNNN-<slug>.md`
  (ADR). One decision per file. Never edit an accepted ADR to change its
  meaning; supersede it with a new one.
- **Feature-level requirement or task state** → the Kiro spec or the ODD
  feature document, never both.
- **Invariant, gotcha, dead end, environment constraint** → `MEMORY.md`, one
  line each, with the evidence or path that proves it.

## Session close

Append to `MEMORY.md` only what a future session would otherwise have to
rediscover:

- decisions that are not already an ADR;
- gotchas and their root cause;
- approaches that were tried and failed, and why;
- open questions that block work.

Keep it short. `MEMORY.md` is an index, not a journal. Move detail into an ADR
or the feature document and leave one line behind.

## Never store

Secrets, tokens, customer data, personal data, internal URLs, or anything the
repository should not contain. If a fact requires that kind of detail, record
only the safe reference: file path, config key name, or ticket identifier.
