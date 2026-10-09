# 30 Second Drawing Game

Open `30sDrawingGame.html` directly, or serve this folder with a static HTTP server. No backend or downloads are needed; reference images and sound generation are local.

Game settings is collapsed by default. Open it to enter 1–12 unique player names, choose prompts, and set 10–120 drawing seconds. Everyone draws on paper at the same time. Ready and Set conceal the prompt; Go reveals it after two seconds and begins drawing. Players lock after starting the first round.

At time up the host selects a winner for one point, or No winner. Correct the current result before moving to Next round; changing the winner recalculates scores. Skip ends drawing without points. Each revealed prompt is used once until a reset. Cancelling preparation leaves the prompt unused.

Reset word pool stops the round, replenishes words and keeps scores/history; a cancelled drawing attempt is recorded as aborted. New Game stops play, clears scores/history, refills words and unlocks players. Both ask for confirmation. Roster, settings, selections and custom words remain. Refresh clears game data; only theme/sound preferences are saved.

Search filters words and categories without changing selections. Select all includes hidden results. Category checkboxes support partial selection. Add newline-separated custom words: up to 10 custom categories/200 words, 40 characters per category and 80 per word. Labels remain literal text. Invalid batches add nothing.

Reference images default to After round; During drawing reveals them at Go. Custom words have no image; missing images never block play. Sound uses Web Audio after a user gesture and may depend on browser permissions. Mute/volume and system/light/dark themes are available. Reduced-motion preferences disable timer pulsing.

The top-right sun, moon and monitor icons select light, dark and system themes. The main page shows Game settings, the prompt/reference and timer, the scoreboard, then round history. Start round uses the current settings; it automatically closes configuration so players can focus on drawing.

Choose **Finish game** between rounds after resolving the result to reveal an animated top-three podium and rows for everyone else. Scores are frozen after finishing. Equal scores share a competition rank (for example 1, 1, 3); tied players appear in roster order. No points produces a celebratory completion message without claiming a sole winner. With fewer than three players, only actual players appear. **Play again** clears scores/history and reuses the current players/settings. Reduced motion disables podium and confetti animations.

## Source and verification

- `Data.js`: 129 built-in prompts in 18 categories with exact-case local references.
- `game-core.js`: pure validation, lifecycle, selection, scores and custom batches.
- `timer-controller.js`: cancellable monotonic deadline and stale callback guards.
- `audio.js` / `app.js`: audio and DOM effects.

Run `node --test "30 Second Drawing Game/tests/*.test.cjs"` from the repository root. Browser smoke: `node "30 Second Drawing Game/tests/browser-smoke.cjs"` with Playwright installed or `PLAYWRIGHT_PATH` pointing to its package. Redesign smoke: `node "30 Second Drawing Game/tests/redesign-smoke.cjs"` covers collapsed settings, theme icons, game completion, one/two/twelve-player results and keyboard/mobile behavior.

The smoke test uses Edge and a controlled clock; it opens the static page directly.

History is session-only and judging is manual. There is no drawing canvas, online voting or automatic scoring.
