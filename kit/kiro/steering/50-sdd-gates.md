---
inclusion: always
---

# SDD gates for Kiro Specs

This is the strict SDD option. It applies only when a Kiro spec exists at
`.kiro/specs/<feature>/`, or when the human explicitly asks for SDD. Without a
spec, ODD and `40-specs-bridge.md` govern and this file imposes nothing.

A spec is the feature document. Do not create `odd/tasks/<feature>.md` for the
same work.

## Who approves

The human approves. The agent never self-approves, never treats silence as
approval, and never infers approval from a task being started.

In the default kit, `.kiro/**` is denied to agents, so the approval block is
written by the human or by Kiro's spec editor. The agent reads it and stops if
it is missing or draft. If you customized the permissions to allow
`.kiro/specs/**`, the agent may write the block only after the human explicitly
approves in the conversation.

`requirements.md` and `design.md` must contain:

````markdown
## Approval

- Status: draft
- Approved by:
- Date:
````

`Status` is exactly `draft` or `approved`. `Approved by` is a name or handle,
never a role. `Date` is ISO `YYYY-MM-DD`. A missing section counts as `draft`.

## Gate 1: requirements

Do not design, plan tasks, or write code until all of these hold:

- `requirements.md` exists, or `bugfix.md` for a bugfix spec;
- every requirement has at least one numbered acceptance criterion;
- no `TBD`, unresolved question, or placeholder remains in a criterion;
- `## Approval` says `Status: approved`, with a non-empty `Approved by` and `Date`.

An `S#` is one numbered acceptance criterion in the spec: Kiro's `1.1`, `1.2`,
or an `S1`, `S2` the spec already uses. Use the spec's own numbering
consistently; do not renumber Kiro's criteria.

For a bugfix spec, the expected behavior is the `S#` set and the unchanged
behavior is the regression checklist.

If a condition fails, report the exact file, the missing item, and stop.

## Gate 2: design

Do not plan tasks or write code until all of these hold:

- `design.md` exists;
- it covers architecture, components, data, error handling, and testing;
- each design section names the `S#` it serves, or a short mapping table does;
- no unresolved decision remains;
- `## Approval` is approved as in gate 1.

If the design changes a requirement, update `requirements.md` first, reopen the
affected `S#`, and reset both approvals for the changed parts.

## Gate 3: tasks

Do not write code until all of these hold:

- `tasks.md` exists;
- every task cites at least one `S#`, for example
  `- [ ] 1. Add cart totals — S2, S3`;
- no task exists without a requirement;
- each task is small enough to verify on its own.

If Kiro's generated tasks do not cite `S#`, add a mapping table at the top of
`tasks.md` before approving this gate. That edit belongs to the human or the
spec editor, like the approval block.

`tasks.md` is the tracker. A task is checked only after its outcome and checks
were observed. Keep the commit next to the task it holds.

## Gate 4: implementation

Only after gates 1-3:

- implement one task at a time with ODD: test first, RED then GREEN;
- keep the writer inside its declared edit surface;
- run the task's focused check and the suite;
- after a high-risk change, `verifier` returns a verdict per `S#`;
- use `judgment-day` for an independent adversarial review when the change is
  high risk;
- report the task, the observed result, and the commit; update the status only
  if your permissions allow writing under `.kiro/specs/`.

## Gate 5: change

A requirement change is not a new spec by default:

1. append the human's correction verbatim to the `## Log` at the end of
   `tasks.md`;
2. rewrite only the affected `S#`;
3. reset `requirements.md` to `draft`, and `design.md` too if the design changes;
4. reopen only the tasks linked to those `S#`;
5. re-run gates 1-3 before writing code again.

Never rewrite an approved requirement silently. A new capability gets a new
spec.

## Waivers

Only the human can waive a gate. Record the waiver in the `## Log` as
`Waiver: <gate> — <reason> — <date>`. A waiver is not an approval, and it must
be named in the PR description. Never waive a gate silently.

## Quick Spec is not SDD

Kiro's Quick Spec generates requirements, design, and tasks without approval
gates. Use it only for a throwaway spike. If the result will be committed,
convert it to a full spec and pass gates 1-3 first.

## What actually blocks

These gates are steering: they instruct the agent, they do not cryptographically
enforce. The enforced part remains `permissions.rules` in the agents. When a
gate blocks, name the gate, the file, and the missing item; never proceed "just
this once".
