# Workflow Orchestration

### 1. Demand Elegance
- For non-trivial changes: find the elegant way
- If a fix feels hacky: "Knowing everything I know now, implement the elegant soloution"
- Skip this for simple-obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 2. Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. Not temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.


<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


# Misc
1. Don't use npm or npx. Use bun and bunx instead.