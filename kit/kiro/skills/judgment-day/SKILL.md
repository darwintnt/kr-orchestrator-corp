---
name: judgment-day
description: Adversarial dual review for changes that matter. Use before delivering a high-risk change, when a design decision needs stress-testing, or when you want two independent blind judgments instead of one.
---

# Judgment Day

Two independent blind reviews of the same change, then at most one bounded
correction. The value is independence: a second opinion that saw the first one
is not a second opinion.

## Preparation

Freeze the candidate: note the exact commit or diff range. Both judges review
the same frozen candidate. If the candidate changes, the judgment is void and
must restart.

Write one judge prompt containing:

- the whole specification, every criterion;
- the frozen diff range and baseline commit;
- the exact commands each judge may run;
- the evidence format;
- no hint about what the orchestrator suspects.

## Round 1 — two blind judges

Launch the `verifier` agent twice, in the same turn, with the **identical**
prompt. Do not share the first result with the second. Each returns a verdict per
criterion with observed evidence.

Reduction:

- Both judges agree a criterion is covered → covered.
- Either judge finds a blocker with reproducible evidence → blocker.
- Disagreement without evidence → `cannot determine`; the criterion needs a
  test, not a vote.

## Round 2 — one bounded correction

If there is at least one confirmed blocker, the `writer` fixes **every**
confirmed blocker in one batch, inside its allowed surface. Then one recheck runs
limited to those blockers. No new full sweep, no new findings in this round.

If a blocker survives the recheck, the change is `partial`. Name the blocker and
the genuine human decision it needs. Do not start a third round.

## Hard limits

- At most two rounds.
- At most one correction batch per round.
- Deterministic failures are fixed, not debated.
- A judge that cannot inspect the frozen candidate produces no verdict; report
  the limitation instead of substituting an opinion.
- Judgment Day is discipline, not cryptographic authority. It does not approve
  delivery, commit, push, or release.

## Output

```text
Verdict: approved | partial | blocked
Confirmed blockers: <file:line — criterion — evidence>
Judges: <covered/uncovered per criterion, both>
Correction: <what changed, or none>
Recheck: <command: observed result>
Human decision needed: <exact decision, or none>
```
