# Results and analytics

When an interview ends, the backend builds a `SessionReport` from the session's transcript (`backend/src/analytics/report.ts`). The frontend shows it at `/results?session=<id>`.

The report keeps two kinds of information strictly apart:

| Kind | What it is | Example |
|---|---|---|
| **Measured** | Counted or timed directly from the session. No interpretation. | 8 answers, 153 words, 3 hedges |
| **Assessed** | A rule-based judgement over each answer's text, shown as *strong*, *adequate* or *needs work*. | Specificity: needs work, "no names, figures, dates or amounts" |

It never produces percentages, an overall score, a confidence level or approval odds. Visora is a practice tool, and a number like "82/100 readiness" would suggest an accuracy the rules don't have.

## Measured metrics

| Metric | How it is measured |
|---|---|
| Duration | Session creation to completion (server clock). |
| Answers / questions asked | Answered questions vs. questions the officer asked. The closing remark is not counted. |
| Words per answer | Whitespace-separated words, averaged. |
| Time to respond | Median seconds from the question being issued to the answer reaching the server. For typed answers this includes reading and typing time. |
| Filler words | Whole-word matches of `um`, `uh`, `er`, `erm`, `hmm`, `you know`, `i mean`, `basically`, `actually`, `literally`. `like` is excluded because it is usually meaningful. |
| Hedges | Whole-word matches of `i think`, `maybe`, `probably`, `not sure`, `i don't know`, `kind of`, `sort of`, `i guess`, `hopefully`. These are the same phrases the demo officer probes. |
| Follow-ups | Officer questions of kind `follow_up`. |
| Topics covered | Context topics the interview reached, out of the total for that context. |
| Speaking rate | Always `null` for now. It needs spoken answers, and answers are typed today. |

## Assessed qualities

Each answer is rated on three dimensions. `minWords` is the difficulty's `minAnswerWords` (8 / 12 / 15 / 18 for comfortable to pressure).

| Dimension | Strong | Adequate | Needs work |
|---|---|---|---|
| Completeness | ≥ 2 × `minWords` words | ≥ `minWords` | below `minWords` |
| Specificity | both figures (digits, currency) **and** named details (capitalised words that don't start a sentence) | one of the two | neither |
| Directness | no hedges or fillers | one | two or more |

Each dimension then gets a session-level rating: **needs work** if ≥ 40% of answers need work, **strong** if ≥ 60% are strong, otherwise **adequate**. Weak answers count for more on purpose: two vague answers out of five are worth flagging.

**Relevance** and **consistency** are reported as `not_assessed`. Judging whether an answer addresses the question, or whether it contradicts an earlier one, needs language understanding. These dimensions stay unassessed until an LLM evaluator is added; they are not estimated.

## Feedback

- **Strengths** and **improvements** are generated from the dimension ratings and follow-up counts, and cite the actual numbers ("3 of 8 answers prompted a follow-up").
- **Recommendations** give one generic tip per weak dimension, plus, for each topic answered without specifics, the exact probe question to rehearse (e.g. *Funding: rehearse an answer to "What is the approximate amount, and what does your sponsor do for a living?"*).
- An interview with no answers gets no strengths, and every dimension is not assessed.

## Delivery

1. `interview_completed` carries the full `report` (see [realtime-protocol.md](realtime-protocol.md)).
2. The interview room caches it in `sessionStorage` (`visora-report:<sessionId>`) and links to `/results?session=<id>`.
3. The results page reads the cache first. If it's empty (another tab, or the cache was cleared), it calls `GET /sessions/:id/report` (see below).

Nothing is stored permanently. Once the backend session expires (30 minutes idle by default) and the tab is closed, the report is gone.

### `GET /sessions/:id/report`

| Status | Body |
|---|---|
| `200` | `SessionReport` JSON (`Cache-Control: no-store`) |
| `404` | `{ "error": "session_not_found" }`: unknown, malformed or expired id |
| `409` | `{ "error": "session_in_progress" }`: the interview hasn't ended |

The session id is a server-issued UUID v4 that only the candidate's browser knows, so it acts as the access token. Fetching a report counts as session activity and resets the idle timer.

The frontend works out the HTTP base from `NEXT_PUBLIC_INTERVIEW_WS_URL` (`ws://host:4000/ws/interview` becomes `http://host:4000`). Set `NEXT_PUBLIC_API_URL` to override it.

## Tests

- `backend/test/report.test.ts`: measured values under controlled clocks, ratings for strong and vague answers, filler/hedge counts, follow-up linking, the empty-interview case, and a check that relevance/consistency are never claimed.
- `backend/test/websocket.test.ts`: the report is included in `interview_completed`; the HTTP endpoint returns 409 → 200 → 404 in the right situations and respects CORS.
