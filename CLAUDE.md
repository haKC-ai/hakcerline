# Claude Code — Brain Protocol

> Sourced from `vantagrid/vantabrain`. Active for every session on every machine. VantaBrain is the single source of truth.

---

## Session Start (mandatory, every time)

```
1. get_kernel          ← pulls latest from git, loads identity + patterns + rules
2. recall <project>    ← load prior context for current project
3. recall <topic>      ← load any relevant domain context before touching it
```

Do not write a single line of code before completing all three steps.

---

## Session State Machine

Every session has explicit state. Log transitions with `session_log`.

```
INIT → get_kernel + recall
  ↓
IN_PROGRESS → work, learn, track_pattern, remember
  ↓
CHECKPOINT → session_log (sync: false) — mid-session save
  ↓
COMPLETE → session_log (sync: true) — commit + push
```

If interrupted (crash, context limit, abort): always call `session_log` with `sync: true` before closing, even with partial `next` items. A committed partial log is better than no log.

---

## During the Session

| Trigger | Action |
|---------|--------|
| Discovered something about a tool, API, or env | `learn` |
| Pattern worked consistently across 2+ uses | `track_pattern` |
| Pattern caused a failure or produced bad output | `track_pattern` with `anti: true` |
| Project architecture changes | `remember` → `projects/<n>.md` |
| Error encountered and resolved | `remember` append → `errors/<topic>.md` |
| Two notes are related | `link_notes` to add wikilinks |
| Mid-session checkpoint | `session_log` with `sync: false` |
| Credential, secret, or sensitive value detected in context | stop and flag immediately |

---

## Session End (mandatory)

Call `session_log` with all fields populated:

```
project  — project name (matches directory or repo name)
summary  — what was accomplished, 1–3 sentences
learned  — list of discrete new things discovered this session
used     — tools, CLIs, APIs, libraries exercised
errors   — each error hit + exactly how it was resolved
next     — remaining tasks, blockers, follow-up work
```

`session_log` auto-commits and pushes. Every session end = one git commit. The commit message is your summary.

---

## Note Structure (from Basic Memory pattern)

All notes must have:
- YAML frontmatter: `created`, `updated`, `tags`
- `[[wikilinks]]` to all related notes — the graph compounds over time
- Terse, factual content — no filler

MCP server auto-injects wikilinks on write. Always use `link_notes` when you explicitly know two notes are related.

**Dual-purpose pattern** (from Basic Memory): notes in `projects/` serve double duty — they document both the implementation for Claude and the state for humans reading VantaBrain. Write them to be readable by both.

---

## What Lives Where

| Content | Tool | Path |
|---------|------|------|
| Project architecture, decisions, current state | `remember` | `projects/<n>.md` |
| Discrete tech learning | `learn` | `learnings/<topic>.md` |
| Effective pattern | `track_pattern` | `_kernel/patterns.md` |
| Failure mode | `track_pattern` anti=true | `_kernel/anti-patterns.md` |
| Session log | `session_log` | `sessions/<date>_<project>.md` |
| Error + exact resolution | `remember` append | `errors/<topic>.md` |
| Reference material | `remember` | `references/<topic>.md` |
| MCP tool signatures and usage | `remember` | `references/mcp-tools.md` |

---

## Security Rules (always enforced — Trail of Bits pattern)

These are non-negotiable for every session, every project:

**Think Security First**
- Before implementing any auth, input handling, API call, or data storage — ask: what's the threat model?
- Default to most restrictive access. Expand explicitly, never by default.
- Never write code that would embarrass a security researcher reading it

**Be Conservative**
- Don't implement features that weren't asked for
- Don't refactor code that isn't broken
- Prefer boring, explicit, auditable over clever
- If uncertain about security implications — stop and flag, don't guess

**Respect Privacy**
- No credentials, tokens, or secrets in notes, logs, or code
- Treat any customer data, PII, or internal intel as if it's in a court document
- If a credential appears in context — flag it immediately, do not log it

**Audit Trail**
- Every significant decision gets a note in `projects/` with rationale
- Security-relevant findings go in `errors/` with full context even if not an error
- Session logs are the audit log — be accurate, not optimistic

**Per-project access control note**: When starting work on a project with external exposure (APIs, webhooks, dashboards), run `recall <project>-security` first. If no security note exists, create one at `projects/<n>-security.md` before writing any code.

---

## Code Quality Rules (Cloudflare Workers SDK + Claude Crew patterns)

**Commits**
- Conventional format: `type(scope): description` — e.g. `fix(mcp): handle null vault path`
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`
- Never commit untested changes to anything that runs in production

**Tests**
- Isolation: each test owns its state, no shared mutable fixtures
- If you add a function that has a failure mode — write a test for that failure mode
- Test names describe behavior, not implementation: `should reject empty vault path`, not `test_init`

**Dependencies**
- Never add a dependency without checking: current version, last commit date, known CVEs
- Pin versions in package.json/requirements.txt — never `latest` or `*`
- Document why a dependency was added in the project note

---

## MCP Tool Reference (Basic Memory pattern — tools as first-class citizens)

| Tool | Signature | When |
|------|-----------|------|
| `get_kernel` | `()` | **Every session start** |
| `recall` | `(query, max_results?)` | Before any topic |
| `remember` | `(path, content, tags?, append?)` | Save anything |
| `learn` | `(topic, content, tags?)` | Discrete discovery |
| `track_pattern` | `(name, description, example?, anti?)` | Pattern found/failed |
| `link_notes` | `(from_path, to_path, context?)` | Connect related notes |
| `session_log` | `(project, summary, learned[], used[], errors[], next[], sync?)` | **Every session end** |
| `update_kernel` | `(section, content)` | Update kernel file |
| `git_sync` | `(message?)` | Manual commit+push |
| `git_pull` | `()` | Manual pull |
| `list_recent` | `(n?)` | Browse recent notes |
| `read_note` | `(path)` | Read specific note |

---


---

## Agent Routing

Use subagents for parallel or isolated work. Use Agent Teams when agents need to share findings mid-task.

| Task | Agent | Mode |
|------|-------|------|
| Auth, tokens, secrets, API endpoints, webhook code | `security-auditor` | subagent |
| IOC analysis, APT research, INTSUM drafting, STIX | `intel-analyst` | subagent |
| Flask blueprints, Celery tasks, SQLAlchemy, Python | `flask-dev` | subagent |
| PR review, code quality, test coverage | `code-reviewer` | subagent |
| "What did we decide about X" / historical vault lookup | `brain-researcher` | subagent |
| Multi-domain feature (API + DB + frontend) | team: flask-dev + security-auditor | agent team |
| Parallel security + intel analysis | team: security-auditor + intel-analyst | agent team |

**Agent Teams require Opus 4.6 and `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`** (already set in settings.json).

Spawn guidance:
- Give each agent explicit scope, file references, and success criteria in the spawn prompt
- Security-auditor always runs before any code ships to production
- brain-researcher runs first when prior context is needed — don't guess, always look up


---

## Interface Design (mandatory for UI work)

Any time you are building interface UI — dashboards, admin panels, SaaS apps, tools, settings, data views — you **must** use the `interface-design` plugin. This is non-negotiable.

- **Scope**: interfaces only. Marketing sites / landing pages → `frontend-design` instead.
- **Memory contract**: the plugin reads and writes `.interface-design/system.md` in the project root. That file is the project's **design kernel** — treat it like VantaBrain memory: never overwrite silently, always load at the start of UI work, always offer to save new patterns.
- **Flow**:
  1. Before any component, check for `.interface-design/system.md` — if it exists, load it and announce the direction, depth, surfaces, spacing, and token scale.
  2. If none exists, assess project context and propose a direction from the six (Precision & Density / Warmth & Approachability / Sophistication & Trust / Boldness & Clarity / Utility & Function / Data & Analysis). Confirm with the user before building.
  3. State design choices out loud before each component (tokens, radii, padding, depth).
  4. After the session, offer to save new patterns with `/interface-design:status` or by updating `system.md`.
- **Commands**: `/interface-design:init`, `/interface-design:status`, `/interface-design:audit <path>`, `/interface-design:extract`
- **Anti-pattern**: generating "generic dashboard" output. The plugin's entire purpose is to beat defaults — if you feel yourself reaching for familiar templates, stop and re-read the skill.

Treat `.interface-design/system.md` as a first-class note — when it is updated, `link_notes` it to the matching `projects/<name>.md` entry in the vault so the decision history compounds.

---

## Plugin Playbook (all enabled — pick the right tool for the task)

These are active via `~/.claude/settings.json`. The brain-hook-session injects the relevant subset into each session's context. Reach for them actively — default behavior is to *ignore* plugins unless you name one.

### Research & intel (expand surface, then act)
| Plugin | When |
|--------|------|
| `brain-researcher` (agent) | FIRST for any "what did we decide" / historical lookup. Never guess. |
| `x-research` | Real-time X/Twitter search for dev discussions, breaking news, threat chatter, product feedback. |
| `last30days` | 30-day cross-platform topic research (Reddit, X, web). Community signal. |
| `context7` | Current library/framework/SDK docs. Prefer over web search. |
| `episodic-memory` | Semantic search over past Claude Code conversations — pairs with `recall` for full context. |

### Security, threat modeling, malware, pentest
| Plugin | When |
|--------|------|
| `security-auditor` (agent) | Mandatory before *any* auth/token/webhook/endpoint code ships. Not optional. |
| `security-guidance` | Realtime PreToolUse hook blocking insecure patterns during edits. |
| `openai-security-threat-model` | Repo-grounded threat modeling. Trust boundaries, assets, attacker capabilities. |
| `openai-security-ownership-map` | Security ownership topology — people-to-file mapping, bus factor, stale-owner detection. |
| `ffuf-web-fuzzing` | Authorized web fuzzing with `ffuf`. Auto-calibration, authenticated fuzzing, result analysis. |
| `wooyun-legacy` | Web vulnerability methodology distilled from 88,636 real-world cases (2010-2016). Use for attack surface thinking. |
| `ghidra-headless` | Binary reverse engineering with Ghidra headless — decompile executables, extract functions. Malware triage. |
| `scv-scan` | Solidity smart contract audit (36-category four-phase workflow). Web3 exposure. |
| `intel-analyst` (agent) | IOC analysis, APT research, INTSUM drafting, STIX/TAXII work. |

### Writing code — language-specific
| Plugin | When |
|--------|------|
| `pyright-lsp` | Python LSP, type checking, completions. Auto-engages on `.py` files. |
| `flask-dev` (agent) | Flask blueprints, SQLAlchemy, Celery. Auto-invoke for `*.py` in Flask projects. |
| `python-code-simplifier` | Python cleanup pass after a feature lands. |
| `typescript-lsp` | TS language server for real type info (hovers, diagnostics). |
| `solidity-language-server` | Solidity LSP (Foundry + solc). Required for any smart contract work. |
| `mcp-server-dev` | Building or modifying an MCP server. |
| `agent-sdk-dev` | Building agents via the Claude Agent SDK. |
| `plugin-dev` | Building Claude Code plugins (agents, commands, hooks, MCP integrations, skill packs). |
| `hookify` | Creating hooks that prevent unwanted behaviors by analyzing conversation patterns. |

### Workflow discipline
| Plugin | When |
|--------|------|
| `superpowers` | Brainstorming, debugging discipline, TDD workflow. Start of any non-trivial task, BEFORE opening files. |
| `feature-dev` | Comprehensive feature workflow — codebase exploration → architecture design → quality review. |
| `planning-with-files` | File-based planning with persistent markdown for complex multi-step tasks. Pair with VantaBrain's plan files. |
| `skill-extractor` | Extract reusable skills from the current work session. Meta-feeds the vault. |
| `ralph-loop` | Self-referential Claude loops — run a prompt until task completion. Use sparingly, high leverage. |
| `claude-session-driver` | Launch, control, monitor other Claude Code sessions as workers via tmux. Pair with Paperclip. |
| `double-shot-latte` | Stops "Would you like me to continue?" interruptions. Productivity. |

### Reviewing & QA
| Plugin | When |
|--------|------|
| `code-review` / `code-reviewer` (agent) | After a logical chunk is complete, before committing. Quality, coverage, bugs. |
| `code-simplifier` | After a big change, to consolidate recent code without changing behavior. |
| `coderabbit` | PR review integration for GitHub PRs. |

### Interfaces & browser
| Plugin | When |
|--------|------|
| `interface-design` | Mandatory before building any interface UI (dashboards, admin panels, tools). Memory contract in `.interface-design/system.md`. |
| `frontend-design` | Marketing sites, landing pages, campaigns. |
| `playwright` | Browser automation — form fills, screenshots, E2E, site exposure research. |
| `superpowers-chrome` | Direct Chrome DevTools Protocol access. Deeper than Playwright when needed. |
| `playground` | Interactive HTML playgrounds — single-file explorers with visual controls and live preview. |
| `openai-develop-web-game` | Web game dev loop with Playwright-driven iteration and render-to-text inspection. Use for CHARGEN. |

### Writing & documentation
| Plugin | When |
|--------|------|
| `humanizer` | Remove AI-ish tells from drafts (inflated symbolism, em dash overuse, vague attributions). Polish INTSUMs and reports. |
| `elements-of-style` | Writing guidance from Strunk's Elements of Style. Tight, direct prose. |
| `openai-jupyter-notebook` | Scaffold and edit Jupyter notebooks for experiments and exploratory data work. |
| `claude-md-management` | When editing any CLAUDE.md file. |

### Git, commits, GitHub
| Plugin | When |
|--------|------|
| `github` | `gh` CLI — issues, PRs, releases. |
| `commit-commands` | Staging, commit message generation, amending. |

### Orchestration
| Plugin | When |
|--------|------|
| `paperclip-coordinator` (agent) | Work spanning >1 session, budgets, multi-agent tracking. |
| `superpowers` (brainstorming) | Multi-domain features — start here before spawning teams. |

### The 1% rule
Skills ship inside plugins. **Invoke the relevant skill before any response or action** — even a 1% chance it applies means use it. Red flags that mean "STOP, check for a skill first":
- "This is just a simple question" → check anyway
- "Let me explore the codebase first" → skills tell you *how* to explore
- "The skill feels like overkill" → use it
- "I know what that means" → knowing ≠ using

---

## GitHub — Attribution & Project Tracking

### Identity — non-negotiable

Every commit, PR, and code review must be attributed to:
- **Name**: Cory Kennedy
- **Email**: cory@darkcode.ai
- **GitHub**: @NoDataFound

**Never attribute work to Claude, an AI agent, Anthropic, or any automated system.**
The pre-commit hook enforces this and will block any commit with wrong authorship.

If you are asked to make a commit or PR, verify identity first:
```bash
git config user.name   # must be: Cory Kennedy
git config user.email  # must be: cory@darkcode.ai
```
If wrong, fix before proceeding: the hook will reject it anyway.

### GitHub Projects — session todo tracking

All `next` items from `session_log` are automatically pushed to the GitHub project as tracked items. The project reference is stored at `$BRAIN_HOME/.github-project`.

When starting a session on a project that has a GitHub repo:
1. `recall <project>` — loads prior context including open todos
2. Check open items: `gh project item-list <num> --owner vantagrid`
3. Add `next` items to `session_log` — they auto-sync to the project board

When creating a PR:
- Title follows conventional commit format: `type(scope): description`
- Body must reference the GitHub project item if one exists
- Assign to @NoDataFound
- Never set author/co-author to Claude or any AI

### Pre-commit hook

Installed globally via `init.templateDir`. Blocks commits that:
- Have wrong author name or email
- Contain AI attribution in author fields
- Match credential/secret patterns (API keys, tokens, JWTs, private keys)

Install in an existing repo: `brain-hook`


---

## Paperclip — Agent Orchestration

Paperclip runs at `http://localhost:3100`. It is the orchestration layer above Claude Code — it manages multi-agent companies, tickets, heartbeats, budgets, and goal alignment.

**VantaBrain is Paperclip's memory.** Every Paperclip-spawned Claude Code agent loads the `vantabrain` skill at startup (injected from `_claude/skills/vantabrain`), which instructs it to call `get_kernel` + `recall` before any task.

### When to use Paperclip vs direct Claude Code

| Use Paperclip | Use Claude Code directly |
|---------------|--------------------------|
| Multi-step work spanning >1 session | Single session task |
| Work that needs agent oversight/budget | Quick fix or exploration |
| Recurring scheduled work (heartbeats) | One-off implementation |
| Coordinating multiple agents on one goal | Solo agent work |
| Work that needs a ticket + audit trail | Low-stakes iteration |

### Paperclip MCP tools

| Tool | When |
|------|------|
| `paperclip_status` | Check if Paperclip is running before creating tickets |
| `paperclip_ticket` | Create a ticket for tracked ongoing work |

`session_log` automatically calls `paperclip_status` + `paperclip_ticket` for each `next` item if Paperclip is running.

### Start Paperclip

```bash
cd ~/paperclip && pnpm dev
# or first install: npx paperclipai onboard --yes
```

### VantaBrain skill injection

The file `_claude/skills/vantabrain` is the skill Paperclip injects into every Claude Code agent. It contains the full session protocol. When Paperclip spawns an agent with `skills: [vantabrain]`, the agent automatically knows to load the kernel and use VantaBrain tools.

## Brain Repo

`https://github.com/vantagrid/vantabrain.git`
Local: `~/VantaBrain`
MCP: `~/VantaBrain/mcp/server.js`

New machine bootstrap:
```bash
curl -fsSL https://vb.darkcode.ai | bash
```

New project setup (any directory):
```bash
brain-init
```

Manual sync:
```bash
brain-sync
```
# Project: hakcerline
