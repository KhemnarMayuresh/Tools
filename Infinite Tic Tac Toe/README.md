# Infinite Tic Tac Toe

A strategic twist on Tic Tac Toe: connect your marks while your oldest marks leave the board. Play on one device with a friend or challenge the computer. No account or installation is needed.

**Quick start:** open `index.html`, choose **Start match**, and take turns selecting empty squares. The default is two players on a 3 × 3 board, connecting 3 marks.

## How to Play

1. Open **Game settings** if you want to change the board, names or opponent. Settings start collapsed; the defaults are ready to play.
2. Select **Start match**. X starts the first round.
3. On your turn, choose an empty square. Connect the selected number of marks horizontally, vertically or diagonally to win.
4. Each player keeps as many active marks as the grid size. On a 4 × 4 board, each player keeps **4 marks**, even if the winning length is 3.
5. At capacity, your oldest mark disappears **before** your new mark is placed and the win is checked. A dashed square labelled **next** identifies the mark that will leave on that player's next move. Both players' queues show oldest → newest order.
6. Choose **Next round** after a win or draw. Scores and round history stay in the match, and the starting mark alternates: X, O, X, O. The computer always plays O, including opening alternate rounds.

You must choose a square that is empty **before removal**. You cannot overwrite your oldest mark directly. A disappearing mark cannot contribute to a winning line.

A round is drawn when the same **complete position** occurs three times (board, ordered mark queues and next player), or at the configured move limit. The initial position counts once. Only legal placements count; a win on the final allowed move takes precedence over a draw. Default limit: **200**, adjustable from **20 to 1,000**.

## Live Demo

- [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/Infinite%20Tic%20Tac%20Toe/index.html)
- [Main-branch GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/Infinite%20Tic%20Tac%20Toe/index.html)
- [Historical GitHack preview](https://rawcdn.githack.com/KhemnarMayuresh/Tools/d63d03564fb59a87508e3c5a153a23b9316b66d7/Infinite%20Tic%20Tac%20Toe/index.html) — older version with older rules and controls.

Preview availability and deployment of these changes have not been verified. For the current checkout, open the local file or serve the repository as described below.

## Features

- **3 × 3 through 10 × 10 boards**, with winning length from 3 to the board size.
- **Two players or Computer O**, with six distinct difficulty levels.
- **Rolling marks** with oldest-mark labels and ordered queues.
- **Pause, resume, undo and round restart**, with cancellable computer turns.
- **Match scoreboard and completed round history**, with alternating starters.
- **Inline results and winning-line highlights**, without blocking alerts.
- **Light, Dark and System theme icons** at the top right.
- **Optional local sound and volume controls**, with reduced-motion support.
- **Keyboard and touch controls**, with internal scrolling for large boards.
- **Offline, static operation**: no account, remote assets, tracking or sent game data.

## Requirements

- A modern browser with JavaScript enabled, such as Edge, Chrome, Firefox or Safari.
- No Node.js, package installation or backend is needed to play.
- Web Workers speed up computer decisions when allowed. Restricted direct-file browsers fall back to a bounded local decision and show an inline notice.
- Audio and local storage are optional. If either is denied, the game remains playable.

## Installation

Clone or download [this repository](https://github.com/KhemnarMayuresh/Tools), keeping all files in the `Infinite Tic Tac Toe` folder together. Open **`Infinite Tic Tac Toe/index.html`** in your browser.

For static HTTP serving, run this from the repository root if Python is installed:

```sh
python -m http.server 8000
```

Then open [the local game](http://localhost:8000/Infinite%20Tic%20Tac%20Toe/index.html). Stop the server with Ctrl+C. Internet access is not needed after downloading the files.

## How to Use

| Control | What it does |
| --- | --- |
| Game settings | Choose grid size, winning length, opponent, names, computer level and move limit before starting. |
| Start match | Locks match settings and starts round 1 with X. |
| Pause / Resume | Preserves the board and turn. Computer work is cancelled while paused and scheduled again on resume when O is due. |
| Undo — two players | Removes the last placement and restores any mark it displaced. |
| Undo — computer | Removes your most recent X placement and any later O response. If O is still thinking, only X is removed. An opening O move cannot be undone on its own. |
| Restart round | Confirms discarding unfinished moves; keeps the same settings, starter, round number and match scores. |
| Next round | Starts an empty board after a completed round and alternates the starter. |
| New match | Confirms clearing progress, scores and history, then unlocks settings. |
| Theme icons | Select Light, Dark or System. System follows browser/device appearance changes. |
| Sound / Volume | Adjust optional tones inside Game settings, including during a match. |

Undo preserves a paused state and removes abandoned repetition counts. Completed rounds cannot be undone or restarted; use Next round or New match. Cancelling a confirmation keeps the current match; no computer move occurs while the confirmation is open.

Player names are trimmed, Unicode-normalized, case-insensitively different and **1–40 Unicode characters** long. Names are displayed as literal text. Internal marks remain X and O. In computer mode, O is named Computer.

**Keyboard:** Tab to the board, then use arrow keys to move between cells. Home and End move to the first and last cell in the current row. Enter or Space places a mark. Occupied cells can be inspected but cannot be played. Scroll inside the board region on larger grids.

Boards, names, scores and round history are kept only for the current page session; refreshing clears them. Only valid theme and sound/volume preferences are saved locally, under `tic-tac-toe-theme` and `tic-tac-toe-sound`. Default theme is System; default sound volume is 20%. No game data is sent to a server.

## AI Levels

| Level | Behavior |
| --- | --- |
| 0 | Random legal moves. |
| 1 | Takes an immediate win; otherwise random. |
| 2 | Takes a win or blocks an immediate threat; otherwise random. |
| 3 | Win/block tactics followed by center and adjacency preferences. |
| 4 | Tactics plus search up to depth 2, at most 5,000 nodes. |
| 5 | Tactics plus search up to depth 4, at most 15,000 nodes. |

All simulations use the actual rolling-removal rules. Search considers at most 12 ordered candidates per position, with a 50 ms worker decision budget. A 1.5-second watchdog catches missing worker responses. The local fallback is limited to depth 2, 1,500 nodes and 25 ms. Time limits can stop search early, returning a legal fallback. A known immediate block is retained if deeper search cannot complete. These limits keep play responsive; no level is guaranteed to be unbeatable.

Presentation delays are 80 ms for levels 0–1, 180 ms for 2–3 and 280 ms for 4–5. While the computer is thinking, human placement is locked. Pause, undo, restart and new match invalidate stale decisions.

## Code Structure

| File | Purpose |
| --- | --- |
| `index.html` | Accessible page, collapsed settings, board, scores and history. |
| `styles.css` | Responsive layout, themes, focus, oldest/winning marks and reduced motion. |
| `game-core.js` | Pure validation, rolling placement, wins, draws, pause and undo. |
| `match-core.js` | Normalized players, deduplicated outcomes, scores and starter alternation. |
| `ai.js` | Pure rolling-aware tactics and bounded search. |
| `ai-worker.js` | Background computer decisions. |
| `ai-controller.js` | Delay, worker, watchdog, cancellation and fallback ownership. |
| `audio.js` | Optional gesture-initialized local tones. |
| `app.js` | Rendering, actor checks, match controls and preferences. |
| `tests/` | Engine, AI, lifecycle, audio and browser checks. |

## Developer Checks

Node.js is needed only for these checks:

```sh
node --test "Infinite Tic Tac Toe/tests/*.test.cjs"
```

Browser checks use Playwright and an installed Edge browser. If Playwright is installed outside this project, set `PLAYWRIGHT_PATH` to its module folder. From the repository root:

```sh
node "Infinite Tic Tac Toe/tests/browser-smoke.cjs"
node "Infinite Tic Tac Toe/tests/browser-integration.cjs"
node "Infinite Tic Tac Toe/tests/browser-lifecycle.cjs"
```

Screenshots go to the system temporary directory by default; `TIC_SCREENSHOTS` can override the output folder. Browser checks exercise direct-file and static HTTP loading, worker success/fallback, game actions, theme preferences, accessibility, responsive layouts and Back/Forward cache restoration.

## Contributing

Ideas, bug reports and pull requests are welcome through [GitHub issues](https://github.com/KhemnarMayuresh/Tools/issues). Include browser, grid size, winning length, opponent mode and steps to reproduce a problem. Online multiplayer and custom display symbols are possible future improvements.

## License

Available under the [MIT License](../LICENSE).

## Author

**Mayuresh Sunil Khemnar** · [GitHub](https://github.com/KhemnarMayuresh)

