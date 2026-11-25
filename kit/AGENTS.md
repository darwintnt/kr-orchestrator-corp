# Project entry point

Always included by Kiro on every surface. Keep it short: the rules live in `.kiro/steering/`.

## Session start

1. Read `MEMORY.md` if it exists.
2. Confirm the steering rules are loaded: workspace `.kiro/steering/` or global `~/.kiro/steering/`.
3. Run `git status --short` and `git log --oneline -10`, if git is available.
4. If `.kiro/specs/` contains a spec for the current work, apply `50-sdd-gates.md` before any implementation.

## Working rules

- ODD is the default workflow: authorize, explore, resolve, classify, track, implement, close. See `00-odd-core.md` in the loaded steering files.
- A Kiro spec at `.kiro/specs/<feature>/` is the feature document. Never create a second one under `odd/tasks/`.
- When a spec exists, `50-sdd-gates.md` applies: do not implement until `requirements.md` and `design.md` are approved and every task cites an acceptance criterion (`S#`).
- Test first: observe RED, implement GREEN, refactor with tests green.
- Conventional Commits. No AI attribution trailers. Never `git push`, force-push, or merge.
- Artifacts (code, comments, docs, commit messages) in English. Reply to the human in their language.
- Architecture decisions go to `docs/decisions/`. No secrets in any tracked file.
- If a tool is missing (no git, no test runner), say so and continue with the checks that do exist. Never install anything to satisfy a check.
