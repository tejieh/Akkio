# AGENTS.md

## Task Completion Requirements

- All of `bun fmt`, `bun lint`, and `bun typecheck` must pass before considering tasks completed.

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Bun
- Next.js

## Core Priorities & Principles

1. Performance first.
2. Reliability first.
3. Keep behavior predictable under load and during failures
4. Demand elegance without over-engineering
5. Find root causes. Not temporary fixes. Senior developer standards.
6. Always use bun and bunx instead of npm and npx
7. Never use 'UseEffect' in React.

If a tradeoff is required, choose correctness and robustness over short-term convenience.

## Maintainability

Long term maintainability is a core priority. If you add new functionality, first check if there is shared logic that can be extracted to a separate module. Duplicate logic across multiple files is a code smell and should be avoided. Don't be afraid to change existing code. Don't take shortcuts by just adding local logic to solve a problem.

## Skill Rules

Expect: Use Gemini for all Expect agent-driven workflows. Run Expect from the repo root. Do not use `expect init`. For AI-driven browser testing, use `bunx -y expect-cli@latest tui -a gemini ...`. If an Expect command supports choosing an agent/provider, use Gemini. Direct Expect subcommands such as `open`, `screenshot`, `playwright`, `console_logs`, `network_requests`, `performance_metrics`, `accessibility_audit`, and `close` do not take an agent flag; run them normally. Close the browser after gathering all necessary information.
