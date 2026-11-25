---
name: verification
description: Verify a change against its specification before delivery. Use after implementation, before reporting work as complete, or when a failure is reported. Produces a verdict per requirement with observed command results.
---

# Verification

Verification answers one question: does this exact change satisfy its
specification, and what did we observe? It is not a code review and it does not
approve delivery.

## Before running anything

1. Read the whole specification: every `S#` in the feature document or Kiro
   spec. Never verify one task in isolation.
2. Read the diff against the stated baseline commit.
3. Confirm the exact commands you are allowed to run. Do not invent a runner.

## Method

For each criterion, decide only from evidence:

- **covered** — a test or observed command result proves it;
- **not covered** — no proof exists, or the proof fails;
- **cannot determine** — the environment prevents the check; say why.

Then check the blast radius:

- For every existing command, option, or message the change touches, confirm a
  test still proves its previous behavior.
- Run the differential check: the same input against the base commit and against
  the change, comparing stdout, stderr, and exit code.
- Any unrequested difference is a regression, not a detail.

## Correction bounds

A blocker is fixed by one correction batch that addresses every reported
blocker, followed by one recheck limited to those blockers. The writer owns the
fix; you recheck only the blockers.

- A new finding in the recheck is a follow-up, not a reason for another round.
- A second correction runs only when the recheck shows the same blocker still
  failing.
- A blocker still open after that leaves the unit `partial` and names the human
  decision.

Never loop until clean. Never widen the recheck into a new full sweep.

## Evidence format

```text
S1: covered — tests/cart_test.go:88 asserts the exact message
S2: not covered — no test exercises the empty-cart path
S3: cannot determine — postgres not available in this environment

go test ./...: ok, 42 passed
npm run lint: 2 errors (src/cart.ts:14, src/cart.ts:22)
```

## Rules

- Never report a pass you did not observe.
- Never accept "should work", "probably", or a diff that merely looks correct.
- A pre-existing defect is a follow-up, not a blocker for this change.
- A blocker names the file, line, and criterion.
- Never edit a file. Report the defect and let the writer fix it.
- Never present a partial result as complete. If a required check could not run,
  the affected criterion is `cannot determine`.

## Close

Return the verdict list, the exact commands with observed results, the blockers,
the regressions, and the skipped checks. The human owns delivery.
