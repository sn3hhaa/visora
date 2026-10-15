# Contributing to Visora

Thanks for your interest! This guide covers local setup, the standards the codebase follows, and how changes are submitted.

## Local setup

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/sn3hhaa/visora.git
cd visora

cd backend && npm install && npm run dev     # http://localhost:4000
cd frontend && npm install && npm run dev    # http://localhost:3000 (second terminal)
```

No API keys are needed: the backend runs the deterministic demo officer by default.

## Before you open a pull request

Run the checks for the side you changed:

```bash
# backend/
npm run typecheck
npm test

# frontend/
npx tsc --noEmit
npm run lint
npm run build
```

If you change the interview flow, also run both apps and complete an interview end to end.

## Coding standards

- **TypeScript strict** on both sides. Avoid `any`; validate external input with Zod.
- **Keep layers separate:** WebSocket handlers route messages, the engine holds interview logic, providers hold model or SDK code. UI state never becomes the source of truth for session state.
- **Protocol changes** must update `backend/src/websocket/protocol.ts`, `frontend/lib/realtime/protocol.ts` and [docs/realtime-protocol.md](docs/realtime-protocol.md) together, with a test.
- **Be honest in the UI:** no fabricated metrics, model names or latency. Label anything mocked or demo-only.
- **Match the design language:** light, minimal, editorial. Reuse existing colours and spacing before adding new ones.
- **Privacy:** don't log answer text, and don't upload camera or microphone data without explicit, visible consent.
- Never commit `.env` files or secrets.

## Commits

This repo uses [Conventional Commits](https://www.conventionalcommits.org):

```text
feat(interview): add adaptive follow-up for vague answers
fix(frontend): restore transcript auto-scroll after resume
docs(architecture): document session ownership
test(websocket): cover resume after disconnect
refactor(backend): extract provider timeout helper
ci: add frontend build check
```

Keep each commit to one logical change.

## Pull requests

1. Branch from `main` (`feat/<topic>`, `fix/<topic>`).
2. Describe what changed, why, and how you tested it. Include screenshots for UI changes.
3. Keep PRs focused; unrelated cleanups go in their own PR.

## Reporting issues

Open a GitHub issue with steps to reproduce, what you expected, what happened, and your browser, OS and Node version. Include backend log lines if relevant, with any personal data removed.
