# Infinite Tic Tac Toe Improvements Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax. This is a planning deliverable; implementation requires a separate request.

**Goal:** Make the rolling-mark game correct and easy to understand, with reliable computer turns, configurable winning lines, fair draw rules, undo, match scores, and the same theme/documentation conventions as the other tools.

**Architecture:** Retain the static `index.html` entry point. Extract a pure rolling-board engine, match score bookkeeping, and a bounded AI engine. A controller owns asynchronous computer work; the application renders state and manages accessible controls, local sound, and theme preferences.

**Tech Stack:** HTML, CSS, vanilla JavaScript, classic scripts/Web Workers, Web Audio, Node's built-in test runner, and Playwright/available Chromium for browser checks. No framework, server application, remote assets, or runtime dependencies.

**Spec:** `tools_analysis.md`, section 4, “Infinite Tic Tac Toe — Solid, Needs Enhancements,” supplemented by the verified source findings and explicit rules below. This plan supplies proposed defaults where the report is ambiguous.

## Verified source findings

The current game consists of `Infinite Tic Tac Toe/index.html` with inline CSS/JavaScript and `README.md`.

1. Each player retains **SIZE marks**, not always three. The move-removal comment and the highlight condition (`length === 3`) disagree with the implementation on larger grids.
2. Wins require **SIZE consecutive marks**. The report's claim that initial `SIZE = 10` breaks a selected 3×3 game is inaccurate: Start assigns SIZE from the select before building the board. Configurable winning length is an enhancement, not a correction to that initialization.
3. The tie test counts **currently active marks**, not lifetime moves: `X.length + O.length >= 15`. It can never fire on sizes 3–7 (maximum 6–14 live marks), but can prematurely end sizes 8–10. A full-board draw is also unsuitable for this variant: at most 2N marks occupy N² squares for N≥3.
4. Humans can click during O's computer turn. `handleCellClick` checks started/paused/gameOver but does not identify the actor or reserve AI turns. An old scheduled AI can then play as X because `aiMove` does not verify whose turn it is.
5. AI simulations temporarily add a mark without removing its oldest mark. A verified 3×3 example reports a winning third mark on row 0, but that line disappears when the required oldest mark at (0,0) is removed.
6. Computer timeout handles are not owned or cancelled. Pausing when a callback is pending discards that turn without scheduling a replacement on Resume; restarting can leave obsolete work targeting a newer board.
7. Restart clears the board but leaves `gameStarted = true`, shows Start, hides Pause/Restart, and unlocks grid/difficulty. Players can continue moving on a live board while the page looks like setup. The computer toggle is not locked during a game either.
8. There is a blocking winner alert, production move logging, no winning-line highlight, no score tracking, and no undo/history.
9. The page uses fixed 50px clickable divs without keyboard/board semantics. Large boards have internal scrolling, but body `height: 100vh` and vertical centering can obscure controls on short screens.
10. The README has useful feature/demo sections but lacks current rule guidance and installation instructions. Its relative license target points to a missing folder-local LICENSE; the root license is `../LICENSE`.

## Global constraints and proposed rules

- Scope is **Infinite Tic Tac Toe only**, plus its plan/progress documents. Preserve all earlier tools, existing changes, branches, and user work. No commit, push, deployment, or multiplayer service is implied.
- Keep direct-file opening and static HTTP serving. Use classic browser scripts with Node-testable exports. All visuals and sound remain local.
- Grid size is an integer **3–10**, default **3**. Winning length is an integer **3–grid size**, default **3**. The full-size winning rule remains selectable.
- Each player can retain **grid size** marks. Do not add a separate active-mark-limit setting in this iteration. The page must explicitly say, for example: “4×4 board · connect 3 · keep 4 marks each.”
- A move targets a square that is empty **before** removal. At capacity, remove the actor's oldest mark, then place its new mark, then evaluate the resulting board. Players cannot directly overwrite their own fading/oldest square.
- Win means at least the configured winning length consecutively, horizontally, vertically, or diagonally. Detect it after removal/placement; return coordinates for the visible winning line. If one move completes multiple lines, highlight all winning segments through it.
- Every round starts with an empty board. X starts the first round. Subsequent completed rounds alternate the starting mark; computer remains O and may therefore open an alternate round.
- Draw when the **same complete position occurs three times**, or after a configured move limit. Position keys include board, ordered X/O queues, and side to move, so identical visible boards with different eviction order are not conflated.
- Move limit defaults to **200 legal placements**, with integer settings **20–1,000**. Display the count/limit. Check wins before draw rules so a winning move at the limit wins. Initial position counts once; rejected clicks do not affect history/counts.
- Two local players or Human X vs Computer O. Match settings are snapshotted and locked after Start. Changing names, mode, grid, win length, difficulty, or move limit requires **New match**.
- Names are trimmed/NFC-normalized, nonempty, at most **40 Unicode code points**, and case-insensitively unique. Defaults: Player X and Player O; computer mode shows Computer for O. Internal marks remain X/O; custom display symbols are deferred.
- Match statistics are X wins, O wins, and draws, plus completed round history. Record each round ID once. Keep them in page memory; refreshing does not restore boards, names, or scores.
- **Next round** appears after a win/draw and starts with the same match settings, an empty board, and the alternating starter. **Restart round** discards an unfinished round without points, keeps the current starter/round number, and invalidates AI work. **New match** confirms clearing progress when a round is active or scores/history exist, then returns to editable setup.
- **Pause/Resume** preserves board and turn. Cancel pending computer work on Pause; Resume schedules exactly one computer action if O is due. No background action changes a paused board.
- **Undo** is available only during unfinished playing/paused rounds. In two-player mode, undo one placement. Against computer, remove the most recent human X placement and any later computer response; if the response is pending, cancel it and undo only X. A computer opening before the first X move cannot be undone by itself. Preserve paused state. Undo rebuilds repetition counts from retained history; it does not roll back a controller generation token.
- Winning/drawn rounds cannot be undone. Explain that result in the UI; use Next round or New match. No score rollback mechanism is needed.
- Computer difficulty keeps levels **0–5** but makes their behavior distinct; no level is advertised as unbeatable. See Task 3 for exact budgets and tactics.
- Persist only theme and sound/volume preferences automatically. Default system theme and sound on with modest volume. Denied audio/storage must not prevent play.
- Match the established UI pattern: top-right sun/moon/system icons, collapsed Game settings by default, primary board/status/actions, scoreboard, and last round-history section. Explain the rolling rule before Start.
- Use inline/live status instead of alert, text nodes for names, winning-line animation that respects reduced motion, and locally synthesized placement/win/draw tones.

## Review focus

- Human clicks, obsolete computer responses, Pause/Resume, Undo, Restart, and New match arriving while AI is pending must never produce an extra/wrong-side placement.
- Rolling eviction must apply identically in gameplay, tactical simulation, and search; an apparent win containing the disappearing mark is not a win.
- Repetition must distinguish queue order and turn, undo must remove abandoned counts, and outcome bookkeeping must not award duplicate wins/draws.
- 10×10 grids on narrow/short screens must remain keyboard/touch playable without hiding controls or overflowing the entire page.
- Invalid settings, literal/long Unicode names, denied worker/audio/storage, and direct-file restrictions must keep the game actionable and explain any fallback.

## File structure

| File | Responsibility |
|---|---|
| Modify `Infinite Tic Tac Toe/index.html` | Accessible setup, board, turn/rule summary, actions, results, score/history, and confirmation UI |
| Create `Infinite Tic Tac Toe/styles.css` | Responsive board viewport, themes/icons, oldest/winning marks, focus, reduced motion |
| Create `Infinite Tic Tac Toe/game-core.js` | Configuration validation, rolling placement, wins, legal moves, draws, history, undo |
| Create `Infinite Tic Tac Toe/match-core.js` | Round IDs, starter alternation, completed outcomes, deduplicated match totals |
| Create `Infinite Tic Tac Toe/ai.js` | Pure tactical choices and bounded minimax using the real rolling rules |
| Create `Infinite Tic Tac Toe/ai-worker.js` | Background decision entry point using classic importScripts |
| Create `Infinite Tic Tac Toe/ai-controller.js` | Owned delay/worker/deadline, generation tokens, cancellation, safe fallback |
| Create `Infinite Tic Tac Toe/audio.js` | Gesture-initialized tones, mute/volume/cancellation |
| Create `Infinite Tic Tac Toe/app.js` | DOM rendering, actor gating, controllers, UI preferences, match actions |
| Create `Infinite Tic Tac Toe/tests/game-core.test.cjs` | Placement/eviction, wins/draws, validation, immutable history and undo |
| Create `Infinite Tic Tac Toe/tests/match-core.test.cjs` | Outcome deduplication, alternating starters, restart/new match |
| Create `Infinite Tic Tac Toe/tests/ai.test.cjs` | Legal moves, rolling-aware tactics, reproducibility, search budgets |
| Create `Infinite Tic Tac Toe/tests/ai-controller.test.cjs` | Injected scheduler/worker race and cancellation checks |
| Create `Infinite Tic Tac Toe/tests/browser-smoke.cjs` | Actual user flows, actors, settings, accessibility, mobile and fallbacks |
| Modify `Infinite Tic Tac Toe/README.md` | How to play/use, precise rules, demo links, features, requirements, install, structure, tests, license |

## Shared interfaces

```text
Config = { size, winLength, moveLimit, mode: 'local'|'computer', difficulty: 0..5 }
Player = { mark: 'X'|'O', name: string }
Cell = { row: number, col: number }
Snapshot = { board, queues: {X: Cell[], O: Cell[]}, turn, moveCount,
             positionKeys: string[] }
RoundState = { id, config, starter, board, queues, turn,
               phase: 'playing'|'paused'|'won'|'draw',
               moveCount, history: {before: Snapshot, mark, cell, removed: Cell|null}[],
               positionKeys: string[], winner: 'X'|'O'|null,
               winningCells: Cell[], drawReason: 'repetition'|'move-limit'|null }

validateConfig(config) -> {valid, errors: string[]}
validatePlayers(players) -> {valid, errors: string[]}
createRound(id, config, starter: 'X'|'O') -> RoundState
getLegalMoves(round) -> Cell[]
previewPlacement(round, mark, cell) -> {board, queues, winningCells}|null
playMove(round, cell) -> RoundState
setPaused(round, boolean) -> RoundState
undo(round) -> RoundState
positionKey(round) -> string

createMatch(config, players) -> MatchState
recordOutcome(match, completedRound) -> MatchState
getScores(match) -> {XWins, OWins, draws, completedRounds}
nextRoundInfo(match) -> {roundNumber, starter}

chooseMove(round, {level, random, maxNodes, maxDepth, maxMs, now})
  -> {move: Cell|null, nodes: number, depth: number, stopped: boolean}
createAIController({schedule, cancel, now, createWorker, onMove, onStatus})
  -> {request(roundSnapshot, requestId), cancel()}
```

`playMove` operates only on a playing round and the current mark; it returns the same state for illegal moves. Actor authorization belongs to the application/controller; the AI cannot bypass the pure placement rules. `previewPlacement` supports hypothetical X/O tactical checks but uses the identical eviction/win routine and never mutates input. `setPaused` cannot resume a terminal round. `undo` implements the configured mode's scope above.

AI response shape: `{requestId, roundId, move}`. Controller `onMove(requestId, roundId, move)` fires only for the current uncancelled request. The app additionally checks round ID, playing phase, computer mode, O turn, and move legality. Snapshot the configuration instead of rereading editable DOM controls in any callback.

## Task 1: Correct rolling-board rules and draw detection

**Files:** game-core.js; tests/game-core.test.cjs.

**Interfaces:** Produces validation, createRound, getLegalMoves, previewPlacement, playMove, positionKey, and result coordinates consumed by Tasks 2–6.

- [ ] Write failing tests for sizes 3/4/10; targets 3/full-size; legal/occupied/out-of-range moves; and FIFO removal at capacity. Assert that the pre-removal occupied square is not a legal target.
- [ ] Add all four winning directions, an edge diagonal, a win formed by a middle placement, and the false-win regression: on 3×3 X's oldest (0,0), other marks (0,1)/(2,2), placing (0,2) must evict (0,0) and not win.
- [ ] Add tests that position keys differ when turn or queue order changes; the third identical full position draws; rejected moves do not count; a limit-ending winning move wins rather than draws.
- [ ] Add configuration failures for NaN, infinity, fractions, size outside3–10, target outside3–size, limit outside20–1000, and invalid mode/difficulty. Test long/blank/duplicate NFC player names.
- [ ] Run `node --test "Infinite Tic Tac Toe/tests/game-core.test.cjs"`. Expected: new behavior fails before implementation.
- [ ] Implement the pure interfaces. Deep-copy changed board/queues/history rather than mutating the supplied snapshot. Include initial position once and append each legal move's complete next-turn position. Derive repeat counts from positionKeys.
- [ ] Implement eviction before win detection, returning a deduplicated union of winning segments through the placed cell. The state retains the winning actor as winner while the visible turn is no longer actionable.
- [ ] Rerun the same command. Expected: all core rule/validation tests pass; source-state snapshots are byte-identical after preview/simulation and rejected moves.

## Task 2: Match outcomes, pause and undo

**Files:** game-core.js; match-core.js; core/match tests.

**Interfaces:** Consumes Task1 RoundState; produces setPaused/undo and match outcome/statistics interfaces consumed by app/controller.

- [ ] Write failing pause tests (no placement while paused, resume retains turn, terminal cannot resume) and undo tests for local one-move, computer pending response, computer completed response, computer opening, and paused undo.
- [ ] Verify undo restores the evicted mark and both FIFO queues. A previously visited position abandoned by undo must no longer contribute to a repetition draw.
- [ ] Write match tests: record one win/draw per round ID, reject unfinished round results, repeated callbacks do not change totals, first starter X then O then X, and terminal outcomes remain in history after Next round.
- [ ] Run `node --test "Infinite Tic Tac Toe/tests/game-core.test.cjs" "Infinite Tic Tac Toe/tests/match-core.test.cjs"`. Expected: missing pause/undo/match behavior fails.
- [ ] Implement undo from saved pre-move snapshots. For computer mode, locate the last X move and drop it and later replies; leave an earlier computer opening intact. Keep paused phase if undo was requested while paused.
- [ ] Implement match bookkeeping with a set/list of completed round IDs and outcome snapshots. Restart does not record an outcome or advance alternating starter; a new match clears all totals/history.
- [ ] Rerun the command. Expected: all assertions pass with no duplicate scores and no abandoned repetition counts.

## Task 3: Rolling-aware, bounded AI

**Files:** ai.js; ai-worker.js; tests/ai.test.cjs.

**Interfaces:** Consumes Task1 previewPlacement/playMove/getLegalMoves and Config; produces chooseMove and request-ID worker messages for Task4.

- [ ] Write failing fixtures for O immediate win, true X threat blocking, apparent X/O wins invalidated by FIFO eviction, occupied cells, corner/edge states, even-grid center preference, paused/terminal rounds, and reproducible seeded random selection.
- [ ] Define levels: **0** random; **1** immediate win then random; **2** win/block/random; **3** win/block/center/adjacency; **4** tactics plus depth2 search (5,000 nodes); **5** tactics plus depth4 search (15,000 nodes).
- [ ] Search at most **12 ordered candidates per position**, retaining immediate tactical moves before center/adjacency candidates. Use alpha-beta minimax with a rolling-state heuristic for live, unobstructed lines; terminal results dominate heuristic scores.
- [ ] Use a **50ms** decision budget in the worker; check budget throughout search. Return the best completed decision or a legal tactical/seeded fallback when time/node limits stop search. Do not claim optimal/unbeatable play.
- [ ] Run `node --test "Infinite Tic Tac Toe/tests/ai.test.cjs"`. Expected: new AI fixtures fail before implementation.
- [ ] Implement chooseMove using the pure engine for every simulated placement. Count nodes explicitly; make time/random sources injectable. Respond null for paused/terminal states and preserve the source snapshot.
- [ ] Implement classic worker importScripts for the core and AI. Messages carry requestId/roundId and a validated cell; errors become controller fallback rather than a frozen O turn.
- [ ] Rerun tests, including 10×10 fixtures and maxNodes/maxMs exhaustion using injected clocks. Expected: legal choices, no input mutation, bounded node counts, and no false tactical wins from disappearing marks.

## Task 4: Own computer scheduling and eliminate turn races

**Files:** ai-controller.js; tests/ai-controller.test.cjs; app integration in Task5.

**Interfaces:** Consumes Task3 worker response contract; produces request/cancel and guarded onMove/onStatus.

- [ ] Write an injected scheduler/fake-worker suite for cancel before delay, late old response after restart, double response, pause/resume, worker error/timeout, and replacement request.
- [ ] Run `node --test "Infinite Tic Tac Toe/tests/ai-controller.test.cjs"`. Expected: missing lifecycle protection fails.
- [ ] Own the pending delay, worker, and watchdog. Increment a generation on every cancel/replacement; clear every owned handle and terminate superseded workers.
- [ ] Use presentation delays of **80ms** for levels0–1, **180ms** for2–3, and **280ms** for4–5; show “Computer thinking…” and lock board input. Do not block the main thread while waiting.
- [ ] Set a **1,500ms watchdog** after worker launch. On unavailable/failed worker or timeout, use bounded main-thread fallback (at most depth2/1,500 nodes/**25ms**), returning a legal move or null only if no legal move exists.
- [ ] Resume requests exactly once when a paused O turn becomes playable. Next round opening with computer O also schedules once. Delay completion never rereads the DOM difficulty or mode.
- [ ] Rerun injected-time tests. Expected: only the latest request can emit a move; paused/cancelled requests emit none; failure still produces a bounded legal fallback.

## Task 5: Understandable controls, board and match UI

**Files:** index.html; app.js; styles.css; browser-smoke.cjs.

**Interfaces:** Consumes core/match/controller APIs and immutable round snapshots.

- [ ] Write failing browser flows for setup/defaults, local3×3 win, target3 on4×4, turn/queue indicators, paused board, human clicks during computer O, duplicate old computer replies, Undo, Restart round, Next round, and New match confirmation.
- [ ] Build collapsed Game settings with size, winning length, opponent/difficulty, names, and move limit. Keep Start, Pause/Resume, Undo, Restart round, and New match actionable outside the collapsed controls. Synchronize winning-length options when grid changes; validate before starting.
- [ ] Lock match settings after Start. Restart immediately produces an empty playable board with the same settings/starter; New match returns to non-playable setup, never a half-started state. Confirm discarded progress for Restart after any placement and New match after progress; cancellation preserves the current game.
- [ ] Use button cells in an ARIA grid with roving tabindex. Arrow keys move within bounds, Home/End move across a row, and Enter/Space place a legal mark. Announce row/column, mark/empty, oldest state, and winning cells. Occupied cells remain keyboard-focusable for inspection but reject activation.
- [ ] Show both players' active mark count and ordered age indicators. At capacity, mark each player's oldest cell with a labelled non-color indicator (“next to leave on X's next move”). Announce the removed coordinate after a legal rolling move.
- [ ] Display current actor, “Computer thinking,” rule summary, and move limit. Replace alert/logging with live inline outcomes and highlighted winning cells; controls after terminal state clearly offer Next round.
- [ ] Render scoreboard and completed-round history below the board. Names and labels use textContent. Keep discarded unfinished rounds out of match win/draw totals.
- [ ] Make 3×3 fit narrow screens; larger grids scroll **inside** a labelled board viewport. Cell targets remain at least44×44px. Use min-height rather than fixed100vh; check portrait375px and short landscape640×360.
- [ ] Run browser flows with a paused controlled clock. Expected: moves only belong to the correct actor, exactly one AI action, consistent settings locks, correct scores and focus, no blocking dialogs/console errors or page-level overflow.

## Task 6: Theme icons, sound and accessible feedback

**Files:** audio.js; app.js; styles.css; browser/audio tests.

**Interfaces:** Consumes match/round outcomes; produces optional effects without mutating game state.

- [ ] Write failing checks for top-right Light/Dark/System icon buttons, aria-pressed/persistence, system-theme changes, invalid stored preference fallback, and keyboard operation.
- [ ] Add the same icon group as Drawing Game/Text-Compare/Splitter with44px targets. Store only validated theme and sound/volume values; storage errors do not interrupt play.
- [ ] Generate modest local placement/win/draw tones after gesture audio resume. Deduplicate terminal cues by round ID. Undo/restart/cancel do not play a win/draw cue; cancel currently owned sounds on New match/restart.
- [ ] Add tests for unsupported/denied audio and muted play. Win cells may pulse briefly; reduced motion produces a static labelled highlight. Do not make animation completion a prerequisite for Next round or scoring.
- [ ] Rerun browser/effect checks. Expected: all functionality works with effects blocked, preferences invalid, and reduced motion enabled.

## Task 7: Complete verification and restore a useful README

**Files:** README.md; all Tic Tac Toe tests and implementation files.

- [ ] Run `node --test "Infinite Tic Tac Toe/tests/*.test.cjs"`. Expected: all core, AI, match and lifecycle assertions pass. Run existing Drawing Game/Text-Compare/Splitter suites as repository regressions.
- [ ] Run `node "Infinite Tic Tac Toe/tests/browser-smoke.cjs"` with available Playwright/Edge. Cover direct-file and HTTP, computer-opening alternate round, cancelled prompts, empty/occupied clicks, all legal configurations, repetitions/limit draws, long/literal names, keyboard grid navigation, and mobile/landscape screenshots.
- [ ] Check worker success plus deliberately unavailable worker, blocked audio/storage, pending AI during Pause/Undo/Restart/New match, and delayed/duplicate responses. No obsolete callback may change the board or award points.
- [ ] Inspect console and network: no gameplay logging, blocking alerts, remote assets, or sent game data. Check available Firefox; record unavailable runtimes instead of claiming coverage.
- [ ] Expand README in the established style: quick start, **How to Play**, **Live Demo**, **Features**, **Requirements**, **Installation**, **How to Use**, **AI Levels**, **Code Structure**, developer checks, license, contributions.
- [ ] State the exact rolling order, capacity, configurable target, occupied-oldest restriction, repetition/move-limit draws, alternate starters, undo scopes, pause and reset rules, session-only statistics, AI budget/fallback limitations, and local preference storage.
- [ ] Preserve the HTML Preview link. Replace the historical pinned GitHack preview with a clearly labelled historical link if retained; optionally add a main-branch GitHack URL. Do not claim preview availability or latest-feature deployment without verification. Fix the license link to `../LICENSE`.
- [ ] Run syntax checks and `git diff --check`; inspect the scoped diff and screenshots. Expected: no unexpected changes outside this game, no incomplete placeholders, no undocumented rule discrepancy.

## Delivery order and acceptance

Tasks1–2 establish correct, testable game rules and match outcomes. Tasks3–4 make computer turns legal and cancellable. Task5 provides a complete user flow; Tasks6–7 deliver consistent presentation and verified documentation.

Acceptance: one mark per legal actor action, rolling removal before win evaluation, no phantom computer wins, no human O moves in computer mode, no orphan AI callbacks, meaningful configurable draws, exact undo restoration, one recorded result per round, usable internal board scrolling/keyboard navigation, clear rule/oldest-mark explanations, and accurate README/theme controls.

## Plan self-review

Every report requirement has an owner: win/tie correctness and configurable lines(1), undo/history/scores/names(2/5), bounded AI and delay/cancellation(3/4), inline results and oldest/winning indicators(5), sound/animation/theme/mobile(5/6), documentation/verification(7). Source-specific actor, Restart, pause/resume, and eviction-simulation bugs have explicit regressions. Online multiplayer and arbitrary custom symbols are deferred; this plan does not introduce a backend. No application code was changed while planning.
