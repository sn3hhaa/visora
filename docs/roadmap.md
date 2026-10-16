# Roadmap

Visora is built in small, verifiable milestones. Each one keeps the app runnable and is committed separately.

## Done

| Phase | Milestone |
|---|---|
| 0 | Repository audit: real vs mocked functionality identified |
| 1 | Baseline stability: lint errors and the broken favicon reference fixed |
| 2 | Backend architecture: session manager, state machine, validated config |
| 3 | Functional text interview: deterministic, adaptive demo officer for F-1, H-1B and B1/B2 |
| 4 | Frontend integration: interview room on the real WebSocket session; scripted conversation and fake telemetry removed |
| 5 | Results & analytics: session report with measured metrics, rule-based ratings, feedback and question breakdown; `/results` page and `GET /sessions/:id/report` ([details](analytics.md)) |

## Next

### Live LLM officer
- OpenAI-compatible client; Groq free tier first (Qwen3 32B / Llama 3.3 70B), OpenRouter `:free` models as backup.
- Structured JSON decisions validated by the existing engine; demo officer as fallback.
- Usage caps and timeouts so the free tier can't be exceeded silently.
- LLM evaluator for the report's relevance and consistency dimensions (currently reported as not assessed).

## Planned

### Voice conversation
- Browser audio capture, streaming speech-to-text, end-of-turn detection.
- Officer text-to-speech with a consistent voice; playback, cancellation and interruption.
- Providers behind interfaces: Sarvam AI (free starter credit), browser Web Speech as the zero-cost fallback.

### MuseTalk 1.5 avatar
- Separate Python service that lip-syncs officer audio onto an original, properly licensed officer portrait.
- Verified on free notebook GPUs (Kaggle / Colab), because the development machine has no NVIDIA GPU.
- Without a GPU, the room shows a clearly labelled static officer. Pre-rendered clips are never presented as live output.
- Licenses of the code, weights and source media checked before use.

### Polish
- Branded VISORA wordmark loader (reduced-motion aware) and V-monogram favicon.
- Open Graph metadata, responsive and accessibility pass.

### Ship
- GitHub Actions: backend tests, type checks, frontend lint and build.
- Playwright end-to-end tests for all three categories.
- Deployment guide: static or edge frontend, long-lived WebSocket backend, optional GPU avatar service.
- Cost and free-tier document checked against official provider pricing.

## Design decisions

| Decision | Why |
|---|---|
| Fastify WebSocket, not LiveKit (for now) | Text and control messages fit a single socket; LiveKit is reconsidered only if audio/video transport needs WebRTC. |
| In-memory sessions, no database | One process, short-lived interviews; nothing needs persisting yet. |
| No vector database | The officer is a stateful conversational agent, not a retrieval app; the transcript is the context. |
| LLM proposes, engine decides | Model output can be wrong or malformed; session state is only changed after validation. |
| Free-first providers | The project must be buildable and demoable for ₹0. Paid services stay optional. |
