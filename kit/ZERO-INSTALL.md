# Zero-install: what can and cannot be reproduced

You asked whether every agent, skill, and the orchestrator from Gentle AI can be used on a machine where nothing can be installed. Verified against `main` on November 2026.

## Verdict

Yes for the discipline. No for the authority.

| Layer | Zero install? | Why |
| --- | --- | --- |
| Steering rules (ODD, TDD, memory, commits, SDD gates) | Yes | plain Markdown that Kiro reads |
| Custom agents and edit surfaces | Yes | Markdown plus `permissions`, enforced by the Kiro runtime |
| Skills | Yes | Kiro implements the Agent Skills standard; same `SKILL.md` format |
| Judgment Day (dual blind review) | Yes, as a method | text only; it issues no receipt and grants no delivery authority |
| `jd-*` and `review-*` agents as shipped | No, not as-is | their bodies call Engram MCP tools and the native review flow |
| Engram memory | No | it is an external MCP process |
| Native RDD (frozen candidate, receipts, acknowledgement) | No | implemented in the Go binary |

## What the official integration actually does on Kiro

Verified in `internal/agents/kiro/adapter.go` on `main`:

- `InstallCommand()` returns `AgentNotInstallableError`. It never installs Kiro.
- `SteeringDir` resolves to `~/.kiro/steering`, `SkillsDir` to `~/.kiro/skills`, `SubAgentsDir` to `~/.kiro/agents`.
- the orchestrator is a template: `internal/assets/kiro/orchestrator.md` contains `{{GENTLE_AI_ODD_SECTION:...}}` placeholders, so the steering file you receive from the installer is generated text, not a file you can copy from the repository unmodified.

So on Kiro, "install" means: write text files into `~/.kiro`, and register MCP servers. Nothing is compiled, no service runs, no administrator rights are involved. That is why a manual copy produces the same result for the parts that are pure text.

## Inventory on `main` (2,881 files)

| Artifact | Count | Path |
| --- | --- | --- |
| Bundled skills | 15 | `internal/assets/skills/*/SKILL.md` |
| Shared skill contracts | 10 | `internal/assets/skills/_shared/` |
| Kiro agent assets | 8 | `internal/assets/kiro/agents/` |
| Kiro orchestrator and persona | 2 | `internal/assets/kiro/` |
| OpenCode agent assets | 10 | `internal/assets/opencode/agents/` |
| License | MIT repository, `Apache-2.0` declared by each skill | `LICENSE`, skill frontmatter |

The eight Kiro agent assets are `jd-fix-agent`, `jd-judge-a`, `jd-judge-b`, and five `review-*` lens agents (`review-risk`, `review-resilience`, `review-readability`, `review-reliability`, `review-refuter`).

## Skill by skill

Portable as they are, copied into `.kiro/skills/<name>/SKILL.md` with the folder name matching `name`. Nine of them now ship in this kit; `judgment-day` ships in its Kiro-adapted form:

| Skill | Note |
| --- | --- |
| `chained-pr` | planning guidance for splitting large changes |
| `cognitive-doc-design` | one `gh pr view` example; the guidance works without it |
| `comment-writer` | writing comments; posting them still needs a tool |
| `judgment-day` | explicitly standalone, needs no review transaction |
| `skill-creator` | authoring skills |
| `skill-improver` | auditing skills |
| `systemic-issue-triage` | triage reasoning |
| `work-unit-commits` | commit slicing |
| `branch-pr` | repository policy; mentions RDD only to say consent stays human |
| `go-testing` | portable, but useless on an image without Go |

Bound to something you cannot install, and therefore not worth copying:

| Skill | Depends on |
| --- | --- |
| `skill-registry` | `gentle-ai skill-registry refresh` |
| `gentle-ai-bench` | the bench journey corpus and its runner |
| `rdd-defect-workflow` | the `gentle-ai review` CLI |
| `issue-creation` | the `gh` CLI and its label workflow |
| `hermes-ephemeral-delegation` | `delegate_task` and an MCP server |

## Why copying the Kiro agents verbatim is a trap

- Their bodies instruct the agent to read and write Engram memory. Without the MCP server those instructions fail or degrade silently.
- The `review-*` agents assume the native capture protocol, which only the binary implements.
- The orchestrator file is a template with unresolved placeholders.

The kit replaces them with agents that depend on nothing: `explorer`, `writer`, `verifier`, `orchestrator`, plus the `judgment-day` skill as the portable substitute for native review.

## Carrying it over

1. Zip `kit/` on the personal machine.
2. Move it through whatever channel your employer approves for public open-source text.
3. Unzip at the repository root and follow `README.md`.

Nothing runs during the copy. No `npm install`, no `npx`, no network, no administrator rights.

## License

Two licenses are in play, and the stricter one wins for the files that carry it:

- The Gentle AI repository is MIT, copyright 2025 Gentleman Programming.
- The bundled skills declare `license: Apache-2.0` in their frontmatter.

The kit ships both texts under `licenses/`, and names every copied file in `THIRD-PARTY-NOTICES.md`. The nine upstream skills in `.kiro/skills/` are byte-identical copies: keep the notice and the Apache text in the repository. The files written for this kit are original, so they need no notice; if you paste upstream text later, add it to that table.

## What no checklist can replace

Authority. A human-approved checklist is a method; a receipt is evidence produced by the tool that froze the candidate bytes. Do not describe one as the other, in either direction.
