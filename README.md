# visora

Realtime conversational AI agent for adaptive interview orchestration, voice interaction, and performance intelligence.

> This README is being rebuilt alongside the implementation. It documents only what currently works.

## Repository

```text
visora/
├── frontend/   Next.js app (landing page, interview setup, interview room)
├── backend/    Fastify + WebSocket interview server
└── docs/       Technical documentation
```

## Backend

Requires Node.js 20+.

```bash
cd backend
npm install
cp .env.example .env   # optional; defaults work for local development
npm run dev            # http://localhost:4000
```

| Command | Purpose |
|---|---|
| `npm run dev` | Start with reload (tsx) |
| `npm run build && npm start` | Compile to `dist/` and run |
| `npm test` | Unit and WebSocket integration tests (Vitest) |
| `npm run typecheck` | Type-check source and tests |

Endpoints:

- `GET /health` — status, active provider and session count
- `ws://localhost:4000/ws/interview` — interview session protocol ([docs/realtime-protocol.md](docs/realtime-protocol.md))

The backend currently runs in **demo mode**: a deterministic, rule-based officer that needs no API keys ([docs/interview-engine.md](docs/interview-engine.md)). A live LLM provider is planned.

## Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:3000
```

The interview room is not yet connected to the backend.
