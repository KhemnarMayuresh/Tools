# 30 Second Drawing Game Improvements Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking. This document plans the work; implementation is a separate request.

**Goal:** Make the Drawing Game reliable across rounds, with player scores, clear timed play, skips, sound cues, custom prompts, and a usable mobile interface.

**Architecture:** Preserve the static entry point and existing local image collection. Extract a pure round/score model and a small deadline-based timer controller from the inline script. The application renders state, manages category/player inputs, and owns audio/image effects; stale callbacks cannot mutate a newer round.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Web Audio API, Node's built-in test runner, and optional Playwright browser verification. No backend, canvas drawing editor, multiplayer service, framework, or external runtime dependency.

**Spec:** `tools_analysis.md`, section 3, “30 Second Drawing Game — Good, Needs Polish.”

## Findings verified against the source

Current files are `30 Second Drawing Game/30sDrawingGame.html`, `styles.css`, `Data.js`, `README.md`, and `images/`.

- `resetGame()` clears display elements but cannot cancel either interval: preparation and drawing interval handles are local variables inside their functions. Restart enables Go while the previous timers remain active, allowing overlapping rounds and obsolete callbacks.
- The prompt appears immediately before Ready/Set/Go. Ready first appears after one second, and the drawing timer starts after four seconds, giving players an early preview and an inconsistent start signal.
- The category-change reset listeners are registered before `window.onload` creates category inputs. The query therefore finds no dynamically created checkboxes.
- Duration is parsed without runtime integer/range validation. HTML min/max attributes alone do not reject invalid settings in the handler.
- Timers decrement a counter once per interval rather than calculating time remaining from a deadline, so delayed callbacks extend a round.
- Category and item names become DOM IDs and CSS selectors. Duplicate names and future custom names containing selector punctuation are unreliable identifiers.
- Data audit: **130 entries across 18 categories**, including a duplicate Charizard entry in Pokémon. Trim the trailing whitespace in the Doraemon name and deduplicate identical category/name pairs.
- **Image references are already local**, contrary to the report. No referenced image is missing, but six paths have case mismatches: Shaggy, Velma, Daphne, Fred, Bubbles, and Buttercup. Windows hides this problem; case-sensitive hosting can fail.
- **Responsive media queries already exist**, contrary to the report's broad claim. The remaining layout work concerns sizing, category browsing, long labels, controls, and narrow-screen overflow.
- Search currently changes visibility and does not implement highlighted matches. The requirement should be to restore all items when cleared, preserve selection, and clear any newly introduced match highlights.
- Instructions describe all players drawing simultaneously and choosing a winner manually. There is no roster, score model, round history, sound, or Skip control.

## Design decisions and global constraints

1. Scope is Drawing Game only. Preserve Text-Compare, ChatGPT Splitter, earlier plans, and their current Git state.
2. Keep `30 Second Drawing Game/30sDrawingGame.html` as the entry point and support both direct-file opening and static HTTP serving.
3. This remains a facilitator for drawing on paper or another surface: all players draw the same prompt at the same time. Do not introduce a drawing canvas, automatic judging, or online voting.
4. Duration defaults to 30 seconds and must be an integer from 10 to 120. Invalid values produce an inline error before consuming a prompt or starting a callback.
5. Proposed roster: 1–12 players; default Player 1 and Player 2. Names are trimmed, nonempty, at most 40 Unicode code points, and unique after NFC normalization and case-insensitive comparison. One-player use is allowed.
6. Freeze roster membership/names once the first round starts. New Game unlocks the roster. This keeps scores and history consistent without designing player deletion/migration rules.
7. Ready appears at preparation start; Set at +1,000 ms; Go, prompt reveal, and the drawing deadline begin together at +2,000 ms. No prompt or reference image is revealed before Go.
8. Drawing time uses a monotonic deadline. Tick frequency affects display updates, not round length. Expiry occurs at most once, including after background-tab delays.
9. Each eligible prompt is used once until Reset word pool or New Game. Selection/search changes do not silently replenish used prompts. A prompt is consumed when Go reveals it; cancelling preparation leaves it available.
10. Skip during drawing consumes the prompt, records a skipped attempt with no points, and enters review. It does not automatically begin another countdown. Skip is disabled during preparation and review.
11. On normal expiry, enter review. The host selects one winner worth one point or No winner. The result must be resolved before Next round. A result can be corrected while that review remains open; scores are recalculated from history rather than incremented repeatedly.
12. Reset word pool replenishes prompts and cancels the active round while retaining players, scores, and history. New Game clears scores/history/used prompts while retaining roster, prompt selections, custom prompts, duration, and UI preferences. Destructive progress resets use an in-page confirmation.
13. Cancelling an active drawing round records an aborted attempt with no score. Cancelling preparation records no attempt. New Game clears the old history after confirmation; Reset word pool retains the aborted record.
14. History shows attempt number, prompt/category snapshots, configured duration, outcome (completed/skipped/aborted), and winner if any. It is kept in memory for this session; refresh does not silently restore a running game.
15. Sound defaults on with a mute toggle and modest volume. Initialize/resume audio only from a user gesture. Unsupported or denied audio must not block play.
16. Give one cue for Ready/Set/Go, one per remaining second 5 through 1 while visible, and one buzzer on expiry. Do not replay missed countdown cues after returning to a hidden tab; cancelled/skipped rounds do not buzz.
17. Use red color, explicit “5 seconds remaining” text, and an optional gentle pulse in the final five seconds. Respect reduced-motion preferences by using a static urgency indication.
18. Reference images have two modes: After round (default) and During drawing. Both modes respect the preparation concealment rule. Missing/failed images show a text fallback and never prevent scoring or the next round.
19. Custom input: a category label and newline-separated words. Proposed caps: 10 custom categories, 200 custom prompts total, category labels 40 code points, prompt labels 80 code points. Trim/normalize for duplicate detection; preserve readable Unicode labels. Custom prompts need no image URL or upload.
20. Use stable generated IDs for prompts, categories, players, and rounds. Labels are inert text, never executable HTML or selectors.
21. Store only theme/sound preferences automatically. Do not automatically persist player names, custom words, scores, or history. No data is sent to a service.

These defaults fill gaps in the report. They define an implementable round/scoring workflow without expanding this party game into a separate application.

## Review focus

- Restart, cancel, or New Game during preparation/drawing must stop obsolete callbacks and audio, with correct prompt consumption.
- Background-tab delays and repeated expiry ticks must finish once without extending duration or awarding duplicate points.
- Empty/exhausted pools, duplicate names, Unicode labels, and invalid settings must leave state consistent and actionable.
- Search/partial category selections and custom labels containing HTML or CSS punctuation must preserve selection and render literally.
- Missing/case-mismatched images, blocked audio, reduced motion, and narrow screens must not obstruct play or review.

## File structure

| File | Responsibility |
|---|---|
| Modify `30 Second Drawing Game/30sDrawingGame.html` | Accessible setup, player inputs, preparation/play/review regions, scoreboard, history, confirmation UI |
| Modify `30 Second Drawing Game/styles.css` | Mobile category browsing, play layout, timer urgency, themes, focus and reduced motion |
| Modify `30 Second Drawing Game/Data.js` | Stable built-in IDs, duplicate/name cleanup, exact-case image references; existing labels/default selections retained |
| Create `30 Second Drawing Game/game-core.js` | Pure state transitions, eligible prompts, outcome/scoring rules, validation, custom prompt normalization |
| Create `30 Second Drawing Game/timer-controller.js` | Owned scheduler handles, monotonic deadline, generation tokens, one-time expiry, cancellation |
| Create `30 Second Drawing Game/audio.js` | Gesture-initiated synthesized cues, mute/volume, cancellation and graceful failure |
| Create `30 Second Drawing Game/app.js` | DOM rendering, controls, category/search state, safe images, coordinating core/timer/audio |
| Create `30 Second Drawing Game/tests/game-core.test.cjs` | Round transitions, consumption, scores/history, validation, custom prompts |
| Create `30 Second Drawing Game/tests/timer-controller.test.cjs` | Injected-clock/scheduler tests; no real 30-second waits |
| Create `30 Second Drawing Game/tests/assets.test.cjs` | Exact-case local image existence and unique IDs |
| Create `30 Second Drawing Game/tests/browser-smoke.cjs` | Real control/DOM checks, fake browser clock, mobile and failure paths |
| Modify `30 Second Drawing Game/README.md` | Accurate play/reset/scoring instructions, limitations, static running, verification |

Use classic scripts compatible with the existing static page. Pure core/controller files also expose Node-testable exports. Reuse the current local images; no new artwork or asset downloads are required.

## Shared interfaces and state

```text
Prompt = { id: string, categoryId: string, categoryName: string,
           name: string, imageUrl: string|null }
Player = { id: string, name: string }
RoundRecord = { id: string, attempt: number, promptId: string,
                promptName: string, categoryName: string, durationSeconds: number,
                outcome: 'completed'|'skipped'|'aborted',
                resolved: boolean, winnerId: string|null, winnerName: string|null }
GameState = { phase: 'setup'|'preparing'|'drawing'|'review'|'exhausted',
              players: Player[], rosterLocked: boolean,
              selectedPromptIds: string[], usedPromptIds: string[],
              active: {roundId: string, promptId: string, durationSeconds: number}|null,
              history: RoundRecord[] }

validateDuration(value: number) -> {valid: boolean, error: string|null}
validatePlayers(names: string[]) -> {valid: boolean, errors: string[]}
createGame(players: Player[], selectedPromptIds: string[]) -> GameState
transition(state: GameState, event: GameEvent, prompts: Prompt[]) -> GameState
getEligiblePrompts(state: GameState, prompts: Prompt[]) -> Prompt[]
getScores(state: GameState) -> {playerId: string, name: string, points: number}[]
normalizeCustomPrompts(category: string, words: string[], existing: Prompt[])
  -> {prompts: Prompt[], errors: string[]}

createTimerController({now, schedule, cancel, onStage, onTick, onExpire})
  -> {prepare(roundId: string, durationSeconds: number), cancel()}
```

Events are `START` (roundId, promptId or null for an exhausted pool, durationSeconds), `BEGIN_DRAWING` (roundId), `EXPIRE` (roundId), `SKIP` (roundId), `RESOLVE` (roundId, winnerId or null), `UPDATE_SELECTION` (prompt IDs), `RESET_POOL`, and `NEW_GAME`.

`START` requires valid roster/duration and setup/exhausted or resolved review. It accepts an eligible prompt; if the eligible pool is empty, a null prompt ID enters exhausted without consuming anything. Invalid/stale prompt IDs leave state unchanged. `BEGIN_DRAWING` consumes its prompt. `EXPIRE`/`SKIP` apply only to the matching active drawing round. `RESOLVE` updates only the current completed review record. Keep the active round descriptor during review so that resolution targets its round ID; reset/new game clears it. `UPDATE_SELECTION` is allowed only between rounds. `RESET_POOL`/`NEW_GAME` are controller-owned cancellation operations before their model transition. Illegal/stale events return unchanged state; user-facing validation explains rejected user actions.

`onStage(roundId, stage)` uses `ready`, `set`, `go`. `onTick(roundId, remainingMs, fraction)` uses nonnegative remaining time and a fraction between 0 and 1. `onExpire(roundId)` fires once. The application derives displayed seconds using `ceil(remainingMs / 1000)` and tracks already-played audio cues by round/second.

Randomness is injected at prompt selection so core tests are deterministic. Timer tests inject a monotonic clock and scheduler; no production-only test flags or shortened test duration are needed.

## Task 1: Clean prompt data and dependable selection

**Files:** `Data.js`, `game-core.js`, `tests/game-core.test.cjs`, `tests/assets.test.cjs`.

- [ ] Write failing tests for unique stable prompt IDs, default category availability, same-category duplicate removal, and exact-case image lookup using directory enumeration rather than Windows `existsSync` alone.
- [ ] Fix the six audited image filename mismatches, trim Doraemon, and remove the duplicated Charizard entry. Expected built-in inventory after deduplication: 129 prompts across 18 categories.
- [ ] Define generated category/player/prompt IDs independent of labels. Keep the existing default-selected category set. Do not rename or delete image assets unnecessarily.
- [ ] Implement `getEligiblePrompts(state, prompts)` from selected IDs minus used IDs. Test selection changes preserve usage, reselected used prompts remain unavailable, and an empty/exhausted selection returns an empty list without random selection.
- [ ] Implement duration/roster validation using the exact proposed limits. Test zero, fractional, NaN, infinity, out-of-range durations; blank/duplicate Unicode player names; 1 and 12 players accepted and 13 rejected.
- [ ] Run `node --test "30 Second Drawing Game/tests/game-core.test.cjs" "30 Second Drawing Game/tests/assets.test.cjs"`; require all assertions to pass.

## Task 2: Round state and cancellable deadline timer

**Files:** `game-core.js`, `timer-controller.js`, `tests/game-core.test.cjs`, `tests/timer-controller.test.cjs`.

- [ ] Add failing tests for setup→preparing→drawing→review, prompt consumption at Go only, and ignored stale/mismatched round events. A cancelled preparation must leave its prompt eligible.
- [ ] Implement the `transition` lifecycle using immutable state updates. Reserve an active prompt during preparation, consume it at `BEGIN_DRAWING`, and record one attempt on expiry, skip, or drawing abort.
- [ ] Implement timer ownership and cancel-all behavior. Ready at 0 ms, Set at 1,000 ms, Go/drawing start at 2,000 ms. Snapshot the selected duration when starting preparation.
- [ ] Use a drawing deadline and approximately 100 ms display ticks; calculate progress from the deadline. A delayed callback after the deadline emits zero remaining and one expiry, with no negative display.
- [ ] Test default 30-second expiry at 32,000 ms from preparation start, 10/120-second durations, callback delays, repeated final ticks, cancel at each preparation stage, cancel mid-drawing, and start a new round while old scheduled callbacks are deliberately delivered.
- [ ] Expose one application cancellation path for Reset pool, New Game, and their confirmed cancellation of an active round. Clear preparation text, prompt/reference visibility, timer urgency, and audio effects consistently.
- [ ] Run both core/controller suites with injected time; require no real-time sleeps and exactly one expiry callback per completed round.

## Task 3: Players, scoreboard, review, and history

**Files:** `30sDrawingGame.html`, `app.js`, `game-core.js`, tests, `styles.css`.

- [ ] Add setup roster controls with default Player 1/Player 2, a scoreboard starting at zero, and locked roster indication after the first round starts.
- [ ] Wire Go/Next round to validated eligible-prompt selection. Hide prompt/images during preparation; reveal them exactly with Go and the timer's start.
- [ ] Replace every `alert()` with inline status or the review panel. Empty pool, exhausted pool, invalid roster/duration, and round expiry must have actionable messages rather than blocking dialogs.
- [ ] On expiry, show the prompt/reference and host result controls: one selected winner or No winner. Next round stays disabled until resolved. No automatic vote tally or drawing-quality inference.
- [ ] Implement `getScores` as the sum of resolved completed records with a winner. Test repeated resolution for the same winner does not add another point, changing the current result removes the old point, skipped/aborted/no-winner records add zero, and stale round IDs cannot affect results.
- [ ] Render history with snapshot labels and outcomes. Explicitly label attempts so skipped/aborted rounds are not mistaken for scored rounds.
- [ ] Add Reset word pool and New Game confirmations. Verify keeping scores/history versus clearing them, preserving current selections/custom prompts, and cancellation during preparation/drawing.
- [ ] Run core tests and browser checks for two complete rounds with different winners, corrected current result, No winner, exhaustion, and both reset actions.

## Task 4: Skip, custom prompts, and category/search behavior

**Files:** `app.js`, `game-core.js`, `30sDrawingGame.html`, tests, `styles.css`.

- [ ] Add Skip in drawing mode only. Cancel timer/audio first, dispatch matching `SKIP`, record the consumed prompt, and enter resolved skipped review. Next round is an explicit action.
- [ ] Test Skip followed by an obsolete expiry cannot change the outcome, award a point, buzz, or replace the next round's display.
- [ ] Add custom category plus newline-separated words with the proposed caps. Deduplicate normalized category/name pairs, ignore blank lines, show validation errors, and select successfully added prompts by default.
- [ ] Validate the complete custom batch before applying it; rejected batches add nothing. Custom names such as `<b>Cat</b>`, `#hero`, and Hindi/emoji text remain literal labels with stable IDs.
- [ ] Replace ad hoc selector/name lookup with application state and event delegation attached after initialization. Category controls reflect checked/unchecked/indeterminate state and selected/total counts; Select all follows the entire pool, including hidden search results.
- [ ] Search filters visible categories/items without mutating selections or usage. Clearing search restores all items and removes match styling. Show “No matches” and selected/remaining totals where useful.
- [ ] Test partial selection, category search, word search, no match, search clear, custom punctuation, duplicate custom entries, and selection changes after a used round.

## Task 5: Audio, reference images, timer urgency, and mobile layout

**Files:** `audio.js`, `app.js`, `styles.css`, `30sDrawingGame.html`, browser tests.

- [ ] Generate short Web Audio tones locally for preparation/countdown and one end buzzer. Add sound on/off and volume controls; audio failure leaves play fully functional.
- [ ] Deduplicate cues by round/stage or round/remaining-second. Test repeated ticks within one displayed second, skip/reset cancellation, muted play, denied audio resume, and returning after hidden-tab delays.
- [ ] Render final-five-second urgency with text/color and optional reduced-motion-aware pulse. Reset urgency immediately when the round is cancelled, skipped, or replaced.
- [ ] Implement After round/During drawing image modes, lazy category thumbnails, exact-case local URLs, meaningful alt text, and a text fallback on image load failure. Prevent an old image event from replacing a newer round's state.
- [ ] Keep preparation, prompt, countdown ring, and review in distinct layout regions. Make category sections collapsible, touch targets at least 44px, labels readable, and long words wrap without page-level overflow.
- [ ] Add system/light/dark themes and visible focus. Preserve settings labels and disabled-state explanations. Announce phase changes/time up through a live region without announcing every 100 ms tick.
- [ ] Test 375px and desktop layouts, long/custom labels, both image modes, broken images, mute, reduced motion, and keyboard operation. Space/arrow keys inside inputs must retain normal editing behavior.

## Task 6: Verification and accurate documentation

**Files:** all Drawing Game changes, `README.md`, test files.

- [ ] Run `node --test "30 Second Drawing Game/tests/*.test.cjs"`; require no failures. Also run existing Text-Compare/Splitter tests to check the shared repository baseline.
- [ ] Run browser smoke tests using a controllable browser clock or injected controller clock: preparation concealment, exact reveal, duration validation, skip, expiry once, score review, resets, custom/search behavior, image/audio failures, mobile layout, and direct-file opening.
- [ ] Perform one real-clock 10-second drawing round to verify the production scheduler/audio integration, without repeating long waits for every case.
- [ ] Check available Chromium and Firefox; record missing runtimes instead of claiming coverage. Inspect desktop/mobile screenshots, console errors, and network requests. Game data must not leave the browser; assets must be local.
- [ ] Document simultaneous drawing, manual winner selection, score correction while reviewing, prompt consumption, cancellation/skip/reset rules, custom prompt limits, sound/image modes, session-only history, and source/test structure.
- [ ] Replace misleading existing restart/start wording and explain the two reset actions. Preserve useful repository links, but distinguish source previews from a verified deployment.
- [ ] Review the final diff for changes outside this game; record verification limitations before declaring completion. No deployment, asset acquisition, commit, or push is implied by this plan.

## Delivery order and acceptance

Tasks 1–2 fix correctness before adding party-game features. Task 3 provides a complete multi-round scoring workflow. Task 4 adds skips/custom prompts and reliable selection. Task 5 improves feedback and presentation; Task 6 verifies the whole experience.

Acceptance: no orphan countdowns, no early prompt reveal, one expiry/outcome per active round, deterministic scoring with no duplicate awards, no automatic repeat of used prompts, usable skips/exhaustion/reset actions, literal custom labels, correct local assets, graceful image/audio failure, and usable desktop/mobile/reduced-motion layouts.

## Plan self-review

All report requirements have owners: alerts/player scores (3), countdown timing and cancellation (2–3), skip/custom words/history (3–4), audio/timer urgency/mobile (5), images (1, 5), and search restoration (4). Source findings—duplicate IDs/data, early prompt preview, invalid duration, missing dynamic listeners, case-mismatched assets, and timer drift—have explicit checks. The plan corrects the report's external-image and absent-responsive-CSS assumptions. No Drawing Game application code was changed while writing this plan.
