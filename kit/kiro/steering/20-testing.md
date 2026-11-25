---
inclusion: fileMatch
fileMatchPattern:
  - "**/*.test.*"
  - "**/*.spec.*"
  - "**/*_test.go"
  - "**/tests/**"
  - "**/test/**"
---

# Test-first discipline

## Default loop

When a relevant runnable test exists and the expected outcome is clear:

1. RED — write one failing test for the requested rule and observe it fail for
   the expected reason.
2. GREEN — implement the smallest change that makes it pass.
3. REFACTOR — clean up while the suite stays green.

Without a meaningful runnable test, state the exception and run proportionate
functional or structural checks instead. Never invent RED/GREEN evidence.

## Coverage of the change

- One RED test per requested rule.
- For every existing command or option the change touches, one test proving its
  previous behavior still holds.
- No padding: no test for the sake of a count, no assertion on implementation
  details the rule does not name.
- A test asserts every observable effect the rule names: output, exit code,
  persisted data, emitted event.
- Tests go through the public interface, not private helpers.
- An existing behavior counts as touched when it shares the code you changed:
  options, parsers, helpers, validation.

## Differential check

For each existing command that shares the code you changed, run it with the new
or changed input against the previous code and against your change, then compare
stdout, stderr, and exit code. Use a scratch copy of the base commit in a
temporary directory outside the worktree. Never commit that scratch copy, and
never make a committed test read git history or a fixed commit.

Any difference nobody asked for is a regression: fix it and pin it with a test.

## Scratch state

Keep temporary directories, `HOME`, `TMPDIR`, and tool caches outside the
worktree. When a path must live inside it, use a git-ignored location and remove
it before finishing. Subagents report scratch paths; the orchestrator removes
them.
