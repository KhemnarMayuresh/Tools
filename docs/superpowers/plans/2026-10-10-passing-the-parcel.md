# Passing the Parcel Game Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax. This is a planning deliverable; application changes require a separate implementation request.

**Goal:** Make Passing the Parcel a ready-to-play party game with reliable music stops, clear host controls, player tracking, optional elimination, accessible presentation, and useful documentation.

**Architecture:** Keep the static `PassingTheParcel.html` entry point. Separate pure round/roster rules from an owned deadline controller, local audio sources, and DOM rendering. Physical-party play is the default; an explicitly labelled on-screen mode simulates parcel movement without claiming to detect a real parcel.

**Tech Stack:** Vanilla HTML/CSS/JavaScript, classic browser scripts with Node-testable exports, Web Audio/HTMLAudioElement, Node test runner, and Playwright with available browsers. No backend, runtime packages, external music requests, or accounts.

**Spec:** `tools_analysis.md`, section 5, plus the verified findings and proposed rules below. Established Drawing Game/Tic Tac Toe theme, settings, scoreboard/history, and README conventions apply. This document proposes the missing game rules for review; it does not describe features already implemented.

## Verified source findings

Current files: `Passing the Parcel Game/PassingTheParcel.html` and `README.md`.

- Uploading audio is mandatory; there are no built-in tracks, players, rounds, results, or elimination.
- Repeated Start clicks create multiple timeouts and overwrite the only stored handle. A source-level VM probe verified that Start twice, then Stop, leaves one live timeout.
- Blank numeric fields produce NaN; fractions are silently truncated by parseInt. The same probe verified a blank minimum schedules a NaN delay. Negative/huge values are not explicitly rejected.
- Input handlers silently increase maximum time when it is less than or equal to minimum. This hides invalid settings rather than explaining them.
- `audioPlayer.play()` is not awaited or caught. The random timer can run even when playback fails; media ending early can leave the game silently waiting.
- File changes remain possible during play. Object URLs are created but never revoked.
- Stop pauses media and clears only the latest timer; Reset seeks to zero and clears the selected file. No controller protects against stale callbacks or late playback promises.
- Contrary to the report's restart-from-beginning claim, Start does not set currentTime to zero: after Stop it generally resumes the current position. Playback-position behavior is implicit and varies after Reset/end of file.
- The page has no visible playing/stopped state, accessible status announcement, confirmation flow, or round record. Body height100vh and width:max-content can clip/overflow a party UI on small screens.
- README already contains demos, features, requirements and instructions; preserve that useful structure, explain new rules, distinguish historical previews, and link the repository MIT license at `../LICENSE`.

## Global constraints and proposed rules

### Game and results

- Scope: this game and its plan/progress documents only. Preserve other tools, user changes, branch and file entry point. No commit, push or deployment is implied.
- Default roster: Player 1, Player 2, Player 3, Player 4. Permit **2–20 players**, one name per line; trim and NFC-normalize; require unique case-insensitive names of **1–40 Unicode code points**. Generate stable session IDs; scores and elimination use IDs, never display names.
- Modes: **Forfeit** (default; everyone stays active, count catches) and **Elimination** (confirmed holder is removed; the last remaining player wins). No automatic winner ranking for forfeit mode: catching the parcel is an event, not a win.
- Play styles: **Physical party** (default) and **On-screen simulation**. Explain the difference before starting.
- Physical party: people pass a real parcel while music plays; when it stops, the host selects the actual holder from active players and confirms. No automatic participant selection or claim to track physical movement.
- On-screen simulation: select a starting player before each round, initially the first active player. Automatically pass clockwise in roster order at a configured interval; the current simulated holder at the stop instant is selected for confirmation. Eliminated players are skipped. State explicitly that this represents on-screen passing only.
- Virtual interval: integer **500–3,000 ms**, default **1,000 ms**. Calculate holder from elapsed active-play time, not animation frames or callback counts. A pass occurs at elapsed >= k×interval; if the stop and pass coincide, apply that pass before selecting the holder.
- Stop range: whole seconds **5–120**, defaults **10–30**, minimum <= maximum. Equal endpoints are valid. Choose one integer-millisecond duration uniformly within the inclusive converted range; snapshot it once per round. Inject randomness for tests. Never silently change user inputs.
- Display elapsed active-play time and Playing/Paused/Music stopped/Awaiting holder/Completed states. Do **not** expose the sampled deadline or a countdown that reveals when a random stop will happen.
- Start requires valid settings, at least two active players, ready audio and no unresolved result. Lock roster, mode, play style, music source, duration range, restart/resume setting and virtual interval for the game. Sound volume/theme remain adjustable.
- Natural random stop and **Stop music** both stop audio and require holder confirmation; history distinguishes random versus manual stop. **Cancel round** discards unfinished play without a catch or elimination, with confirmation after play began. Manual stop is a host override, not an automatic elimination.
- Pause freezes elapsed time, remaining duration, virtual holder and playback position; instruct physical players to hold the parcel. Resume continues the same sampled duration and music position. Cancelling a confirmation resumes only if the round was running before it opened.
- One confirmed result per round ID. Double clicks, late timers and stale audio promises cannot duplicate results or eliminate another player. Names/mode/outcome are stored as history snapshots.
- Holder selection is a preview until Confirm result; require an active player. After confirmation, show the caught player and optional forfeit, update totals/history, then offer Next round. Past results are read-only; no score correction/undo in this iteration.
- Forfeit suggestions: ship **15 short, family-friendly prompts** (e.g., name three fruits, tell a joke, sing one line, do a funny pose). A toggle defaults on in forfeit mode; suggestions are optional, displayed after confirmation, never enforced or scored. Custom prompt editing is deferred.
- Elimination automatically completes when one player remains; show the winner and elimination order. Forfeit mode has **Finish game** after at least one confirmed round, showing each player's catches and round totals without naming winners.
- Finish early in elimination mode is allowed only between resolved rounds, with confirmation; show **Ended early**, remaining players and results, with no declared champion. A naturally completed game is frozen until New game.
- **New game** confirms clearing progress, cancels all owned work, stops music, clears results and unlocks settings. Keep current setup values and uploaded source available for reuse. A separate **Restore defaults** action confirms clearing progress, discards the upload, resets roster/settings, and returns to setup.
- Store game state only in memory. Persist validated theme and volume preferences only. Uploaded files and player/game history are never stored or sent to a server.

### Audio, lifecycle and presentation

- Provide **two original, locally synthesized instrumental loops**, e.g. Party beat and Gentle melody, with Party beat selected by default. No audio upload is required. Do not download third-party tracks; explain local synthesis in README.
- Optional upload: support browser-decodable MP3/WAV/OGG/M4A, with a **50 MiB** cap. File extension/MIME is a hint, not proof of decodability; check readiness and catch playback failures. Invalid replacements preserve the previous usable source and explain the issue.
- Uploaded files loop during a round so ending early cannot decide a catch. Selecting a different source is allowed only in setup. Own and revoke each object URL on replacement/default reset/page disposal; do not revoke a live reusable source on ordinary Cancel round/New game.
- Setting **Each new round: restart music / continue music** defaults to continue. Apply to built-in loop offset or uploaded currentTime at round start. Pause/Resume always retains position regardless of that setting. Preview music is setup-only, gesture-driven, stops on Start/source replacement, and never starts a game timer.
- Await gesture-authorized playback before entering Playing and starting the deadline. Playback preparation/start has a **3-second readiness timeout**. Rejection, timeout, or a playback error/stall during Playing cancels the unfinished round without results immediately; stop audio and offer Retry or change source. Do not silently turn audio failure into visual-only physical play; announce unavailable audio. An intentionally muted volume must show the explicit muted warning.
- A generation token owns playback promises, scheduler callbacks and audio nodes. A late successful play after Cancel/New game must be stopped and must not restart state or music.
- On document hidden/pagehide, auto-pause a running round and stop owned playback; explain why. BFCache restoration must retain the paused round and require explicit Resume. No background elimination or automatic restart on return.
- Use top-right Light/Dark/System icon buttons with44px targets and pressed labels. Settings collapse by default. Order: settings; main parcel/music/status/actions; active players; catches/results; round history last.
- Show a prominent parcel illustration (local SVG/CSS) with a small rhythmic animation while playing. On-screen style may animate between player icons; physical style must not highlight a fictitious holder. Announce only state changes/results, not every music beat/pass.
- On random/manual stop show a visible and accessible “Music stopped — who has the parcel?” result area. Winning/confetti effects are local, brief and reduced-motion aware; results/actions cannot depend on animation completion.
- Use inline validation/confirmation/status rather than alert/confirm. Render names/file labels/prompts as literal text. Use min-height rather than fixed100vh; all controls remain usable at375px portrait and640×360 landscape without page overflow.

## Review focus

1. Rapid Start/Stop/Cancel/New game and late playback promises must never leave audio running or create duplicate/outdated round results.
2. Physical versus simulated holder selection must stay truthful; hidden-tab delays and coincident pass/stop must not eliminate the wrong player.
3. Invalid/unsupported uploads, revoked object URLs, rejected play and blocked Web Audio must keep setup actionable and announce why music is unavailable.
4. Duplicate Unicode names, confirmation cancellation and the last two elimination players must retain stable identities and exactly-once statistics.
5. Hidden documents/BFCache, reduced motion, denied storage and narrow/short screens must preserve paused game state and usable controls.

## File structure

All application/test paths below are under `Passing the Parcel Game/`.

| File | Responsibility |
| --- | --- |
| Modify `PassingTheParcel.html` | Accessible setup, host controls, parcel stage, player choices, results and history |
| Create `styles.css` | Responsive themes, player/parcel layout, focus, reduced motion |
| Create `game-core.js` | Validation, phases, player IDs, confirmed catches/elimination, completion and history |
| Create `round-controller.js` | Deadline, pause/elapsed/virtual holder, generation and late-callback protection |
| Create `audio-controller.js` | Original loops, upload readiness, preview/play/pause/position, URL/node ownership |
| Create `app.js` | DOM, lifecycle events, confirmations, preferences and controller coordination |
| Create `tests/game-core.test.cjs` | Validation, confirmation, identity, counts and completion |
| Create `tests/round-controller.test.cjs` | Injected clocks, stop/pass boundaries, pause, cancellation and races |
| Create `tests/audio-controller.test.cjs` | Fake media/context, stale promises, loop/seek, readiness timeout and resource cleanup |
| Create `tests/browser-smoke.cjs` | File/HTTP party flows, accessibility, themes, uploads and restricted features |
| Create `tests/browser-lifecycle.cjs` | Actual BFCache and document visibility behavior |
| Modify `README.md` | How to play, demos, features, requirements, install, exact controls/rules, structure and tests |

## Shared interfaces

```text
Config = {minSeconds,maxSeconds,mode:'forfeit'|'elimination',
          playStyle:'physical'|'screen',passIntervalMs,
          musicPosition:'restart'|'continue',forfeits:boolean}
Player = {id,name}
Game = {config,players,activeIds,phase:'setup'|'ready'|'starting'|'playing'|
        'paused'|'awaiting-holder'|'resolved'|'finished',
        round:null|{id,startPlayerId,holderId:null|id,elapsedMs,stopReason:null|'random'|'manual'},
        history:Outcome[],winnerId:null|id,endedEarly:boolean}
Outcome = {roundId,roundNumber,holderId,holderName,stopReason,
           elapsedMs,eliminated:boolean,forfeit:null|string}
validateConfig(config) -> {valid,errors:string[]}
validateRoster(names:string[]) -> {valid,names:string[],errors:string[]}
createGame(config,names:string[]) -> Game  // phase ready; stable IDs
beginRound(game,roundId,startPlayerId) -> Game  // phase starting
markPlaying(game,roundId) -> Game
markPaused(game,roundId,paused:boolean) -> Game
markStopped(game,roundId,{reason,elapsedMs,holderId}) -> Game
confirmHolder(game,roundId,playerId,forfeit:null|string) -> Game
cancelRound(game,roundId) -> Game  // ready; no history or roster effects
finishGame(game) -> Game  // between rounds, at least one result
getStats(game) -> {playerId,name,catches,active}[]

createRoundController({now,schedule,cancel,onStop,onTick})
 -> {start({roundId,durationMs,activeIds,startPlayerId,passIntervalMs,playStyle}),
     pause(),resume(),stopManual(),cancel(),snapshot()}
snapshot() -> {roundId,elapsedMs,remainingMs,holderId:null|id}
onStop({roundId,reason:'random'|'manual',elapsedMs,holderId})
onTick({roundId,elapsedMs,holderId})  // visual only, <=4 updates/second

createAudioController({createContext,createMedia,createURL,revokeURL,schedule,cancel,onStatus,onFailure})
 -> {prepare(source),preview(),play({restart:boolean}),pause(),cancel(),dispose(),setVolume(value)}
Source = {kind:'builtin',track:'party'|'gentle'} | {kind:'upload',file:File}
prepare(source) -> Promise<{ready:boolean,label:string,error:null|string}>
play(options) -> Promise<{started:boolean,error:null|string}>
onFailure({message})  // app invalidates round and cancels controller
```

Pure game methods return the same state on stale/illegal events. The app validates the round ID and phase for each controller result; callbacks never reread unlocked DOM settings. Duration sampling happens once in app using validated config and injected random; controller start happens only after audio play succeeds. Audio cancel invalidates pending play but retains the prepared source; dispose/default replacement releases it. Use injected adapters for Node tests and classic browser globals for direct-file operation.

## Task 1: Pure roster, round and result rules

**Files:** game-core.js; tests/game-core.test.cjs.
**Interfaces:** Produces all shared pure Game APIs for Tasks2/4/5.

- [ ] Write tests named `rejects invalid settings and duplicate normalized names`, `confirm records one catch per round`, `elimination skips removed IDs and finishes with one survivor`, `cancel preserves roster/history`, and `early finish never invents a champion`. Assert bounds2/20 players,40 code points, min5/max120, equal times valid, NaN/fractions/infinity rejected, stable names/IDs, stale/double result ignored and history snapshots immutable.
- [ ] Run `node --test "Passing the Parcel Game/tests/game-core.test.cjs"`. Expected: missing APIs/new rule assertions fail.
- [ ] Implement the shared signatures with immutable state and transitions: ready→starting→playing↔paused→awaiting-holder→resolved or finished. Reject confirmation of inactive players and forbid Next round before resolution. Forfeit suggestions are optional strings assigned once per confirmed round. Finishing requires a resolved round; elimination win is only a single surviving ID.
- [ ] Rerun the command. Expected: all roster/result/state tests pass, including two-player elimination and session-only statistics.

## Task 2: Owned deadline and truthful simulated passing

**Files:** round-controller.js; tests/round-controller.test.cjs.
**Interfaces:** Produces controller/snapshot/onStop contracts consumed by Task4; independent of audio/DOM.

- [ ] Write injected-time tests for repeated Start/replacement, Stop twice, stale callback after Cancel, late callbacks, pause/resume without resampling, and physical holder=null. Test duration endpoints5,000/120,000ms and equal configured range.
- [ ] Add exact-boundary tests: interval1,000ms, active IDs[a,b,c], start a; stop at2,999ms selects c, at3,000ms selects a. A late callback at3,600ms for a3,000ms deadline still resolves holder a and elapsed3,000ms. After pause, excluded pause time must not advance holder/duration.
- [ ] Run `node --test "Passing the Parcel Game/tests/round-controller.test.cjs"`. Expected: failing lifecycle/deadline tests.
- [ ] Implement generation/owned timer cancellation and elapsed calculations from a monotonic clock. Natural results use the scheduled active-play deadline; manual stops before the deadline use current elapsed time. If a manual action arrives after the deadline but before a delayed callback, resolve it as the already-due random stop at the scheduled deadline. Use deadline-derived holder, never animation counters. Limit visual updates to4/second; fire onStop once.
- [ ] Rerun the command. Expected: old callbacks emit nothing, resumed remainder is exact, and all holder-boundary checks pass.

## Task 3: Built-in music and safe uploaded audio

**Files:** audio-controller.js; tests/audio-controller.test.cjs.
**Interfaces:** Produces Source/prepare/play/pause/cancel/dispose/volume and failure/status contracts for Task4.

- [ ] Write tests for rejected resume/play, late promise resolution after Cancel, preview replaced by game playback, silent unsupported context, upload50MiB rejection, invalid replacement preserving previous source, URL revocation, looping, seek restart/continue,3-second readiness timeout, and immediate mid-round stall cancellation before a deadline can award results.
- [ ] Run `node --test "Passing the Parcel Game/tests/audio-controller.test.cjs"`. Expected: missing audio ownership behavior fails.
- [ ] Implement two original looping Web Audio sequences with bounded lookahead scheduling, owned nodes and saved playback offset; synthesize only locally. Implement HTMLAudioElement upload playback with loop=true, candidate readiness checks, clear inline failures and generation guards. Stop late-started media after cancellation. Volume clamp0–1, default0.35; volume zero is allowed but show “Muted — players cannot hear the stop.”
- [ ] Rerun the command. Expected: unavailable/failed audio never claims started, every URL/node/timer is released once when appropriate, and pause preserves offsets for both source kinds.

## Task 4: Complete host and round user flow

**Files:** PassingTheParcel.html; app.js; browser-smoke.cjs.
**Interfaces:** Consumes Tasks1–3 APIs; owns play-promise→deadline coordination, confirmation and rendering.

- [ ] Write failing browser flows for default built-in physical game, custom roster, explicit screen passing, random/manual stop, select/confirm holder, cancellation, Next round, forfeit counts, two-player elimination and early Finish game with no winner.
- [ ] Implement collapsed settings and clear large controls: Start round, Pause/Resume, Stop music, Cancel round, Next round, Finish game, New game and Restore defaults. Show settings lock, elapsed time (no deadline countdown), current phase, actual-holder selection and explicit screen-mode label. Require confirmation before applying catches/elimination; unresolved rounds block continuation.
- [ ] Connect Start to gesture audio play. Enter starting while pending; start the timer only after current play success. If startup times out or audio fails/stalls, cancel both controllers and the unfinished round, show Retry/change-source guidance, and preserve scores. Block repeated Start and reject stale promises with round/generation IDs.
- [ ] Render stable active players, catches/results and completed history using textContent. Provide15 built-in forfeit suggestions only when enabled; do not score performances. Natural elimination completion shows champion; other completion shows totals/remaining players without a podium ranking invented from catches.
- [ ] Run `node "Passing the Parcel Game/tests/browser-smoke.cjs"` with available Playwright/Edge. Expected: correct participants/results, exactly-once outcomes, no hidden random duration, no blocking dialogs, and playable retry after rejected audio.

## Task 5: Consistent themes, accessible party UI and lifecycle

**Files:** styles.css; app.js; browser tests; browser-lifecycle.cjs.
**Interfaces:** Consumes Game/controller states; optional visuals/preferences cannot change outcomes.

- [ ] Add failing tests for top-right theme icon keyboard/pressed states, persisted/invalid preference fallback, system-theme changes, literal Hindi/emoji/markup names, reduced motion,44px targets and375px/640×360 overflow.
- [ ] Implement responsive main stage, labelled parcel/participant visuals, inline confirmations with focus restoration, state/result live announcements, keyboard result selection and final history section. Physical mode animation conveys music activity only; screen animation follows controller holder. Reduced motion keeps a static accessible holder/status.
- [ ] Add actual visibility/BFCache tests: hide while playing auto-pauses without eliminating anyone; return stays paused; explicit Resume completes the original remaining duration once. Navigating while audio start is pending cancels it; Back leaves an actionable ready/paused state, never orphan audio.
- [ ] Wire visibility/pagehide cancellation and persisted pageshow rendering. Store validated theme/volume preferences only; denied storage changes appearance/volume for the session and explains persistence failure. Audio availability notice must appear on first failure.
- [ ] Run both browser suites. Expected: truthful visuals, no lost focus or page overflow, no automatic background result and no restart on restoration.

## Task 6: User guide and full verification

**Files:** README.md; all game tests/source.
**Interfaces:** Documents final behavior from Tasks1–5, not proposed/unimplemented extras.

- [ ] Run `node --test "Passing the Parcel Game/tests/*.test.cjs"`. Expected: all game/audio/lifecycle assertions pass. Run existing Drawing Game, Text-Compare, Splitter and Tic Tac Toe unit suites as regressions.
- [ ] Run browser smoke via direct-file and static HTTP, plus actual BFCache lifecycle. Test built-in and uploaded audio, unsupported/corrupt source, denied audio/storage, pending play cancellation, minimum/maximum/equal ranges, manual stop, last-player elimination, confirmation cancellation and completion freeze. Assert console/network contain no gameplay logging, blocking dialogs or remote asset/data requests. Record unavailable browser runtimes rather than claiming coverage.
- [ ] Inspect mobile/landscape screenshots and syntax; run `git diff --check`. Expected: no clipping/overflow, actionable controls, clean scripts/diff, no changes outside this game's scope.
- [ ] Rewrite README with Quick start, How to Play, Live Demo, Features, Requirements, Installation, How to Use, Game Modes, Music, Code Structure, Developer Checks, License and Contributions. Explain physical holder selection, simulated interval/tie boundary, hidden random deadline, manual versus random stop, pause/visibility, restart/continue music, forfeit counts versus elimination winner, session-only data and local preferences.
- [ ] Preserve HTML Preview and label the pinned GitHack URL historical; optionally include main-branch GitHack. Do not claim demo deployment/availability without verification. Explain original synthesized loops and optional browser-dependent uploads, no install needed for play, static serving, and MIT `../LICENSE`.

## Delivery and self-review

Acceptance: play immediately with built-in music; clear physical versus screen passing; one confirmed catch/elimination per round; no orphan audio/timers; no result from failed playback or hidden-tab drift; correct last survivor; usable themed controls and accurate documentation.

Coverage: source timer/validation defects(1/2), music/upload/resources(3), player identity/rounds/forfeit/elimination(1/4), parcel/results/celebration/theme/mobile(4/5), visibility/restoration/fallbacks(3/5), README/regressions(6). Shared API names, phases and stop reasons agree across tasks. Original locally synthesized music replaces third-party royalty-free downloads while preserving instant play. Physical holder detection, online multiplayer, custom forfeit editing, persistent games and historical-result correction are explicitly deferred. No application code changed during planning.

