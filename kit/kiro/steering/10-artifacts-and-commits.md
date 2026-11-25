---
inclusion: always
---

# Artifacts, language, and commits

## Language

- Reply to the user in the language the user writes in.
- Generated technical artifacts are in English regardless of the conversation
  language: code, identifiers, comments, tests, fixtures, commit messages, PR
  descriptions, UI copy, error messages, and documentation.
- If the user explicitly requests another language for an artifact, use neutral
  professional register.

## Commits

Use Conventional Commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`,
`chore:`, `perf:`, `build:`, `ci:`.

- One commit is one reviewable work unit: behavior, its tests, and its docs
  together.
- Never add `Co-Authored-By` or any AI attribution.
- Never push, merge, rebase published history, or force-push. Those remain the
  human's decision.
- Never commit generated files, tool caches, or scratch directories.

## Documentation

When a command, option, flag, or user-facing message changes, update its help
text and the documentation in the same work unit. A change that alters behavior
without updating its documentation is incomplete.

## Scope discipline

Do not expand scope on your own. A finding, a possible improvement, or a
refactor idea is reported, not implemented, unless it serves the authorized
outcome.
