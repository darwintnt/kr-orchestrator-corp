# Project memory

Repo-committed memory. It replaces an external memory service: this file is reviewed in pull requests and travels with the code.

## How to use it

- Read it at session start; the `SessionStart` hook prints the tail.
- Append at session close, only knowledge that would cost real time to rediscover.
- One line per item, newest first in each section. Delete what stopped being true.
- Never store secrets, tokens, customer data, or internal URLs.

## Active decisions

Decisions with consequences still in force. Link the ADR when one exists.

- (empty)

## Invariants

Rules that must stay true. Breaking one is a bug, not a preference.

- (empty)

## Gotchas

Surprising behavior discovered the hard way.

- (empty)

## Dead ends

Approaches already tried and rejected, with the reason. Prevents repeating them.

- (empty)

## Open questions

Unresolved questions with their owner.

- (empty)
