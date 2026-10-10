# Passing the Parcel Game

A party game with built-in music, random stops and clear host controls. Pass a real parcel with friends, or try an explicitly labelled on-screen simulation. No upload, account or installation is needed to start.

**Quick start:** open `PassingTheParcel.html`, select **Start round**, and pass your parcel while the music plays. When it stops, select the actual holder and choose **Confirm result**. Open **Game settings** to enter your players.

## How to Play

1. Gather at least two players and a parcel, cushion or other easy-to-pass object. The default roster has four players; enter your own names in Game settings.
2. Choose **Forfeit** or **Elimination**. Default Forfeit mode keeps everyone playing.
3. Start a round. The page plays local music and chooses a hidden random stop time within your selected range.
4. Keep passing while you hear music. When it stops, hold the parcel where it is.
5. In physical party mode, the host selects who actually has the parcel, then confirms. The page does **not** detect a physical holder.
6. In Forfeit mode, the catch is counted and an optional fun suggestion appears. In Elimination mode, the confirmed holder is removed; the last remaining player wins.
7. Choose **Next round** when everyone is ready. Choose **Finish game** between completed rounds to view results, or **New game** to clear progress and change settings.

A stopped round is not scored until the holder is confirmed. Cancelled rounds and failed music starts do not count. Catch totals are events, not a ranking of winners.

## Live Demo

- [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/Passing%20the%20Parcel%20Game/PassingTheParcel.html)
- [Main-branch GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/Passing%20the%20Parcel%20Game/PassingTheParcel.html)
- [Historical GitHack preview](https://rawcdn.githack.com/KhemnarMayuresh/Tools/d63d03564fb59a87508e3c5a153a23b9316b66d7/Passing%20the%20Parcel%20Game/PassingTheParcel.html) — the older upload-only version.

Preview availability and deployment of these changes have not been verified. Open your downloaded files or use the local server below for the current version.

## Features

- **Ready-to-play music:** two original, locally synthesized instrumental loops.
- **Optional audio upload:** browser-decodable MP3, WAV, OGG or M4A, up to 50 MiB.
- **2–20 named players**, with stable identities and literal Unicode names.
- **Physical party or on-screen simulation**, clearly separated.
- **Forfeit and Elimination modes**, with host-confirmed results.
- **Random or manual music stops**, pause/resume and round cancellation.
- **Catches, active players and round history**, with a winner only when elimination leaves one player.
- **15 optional family-friendly forfeits**, never enforced or scored.
- **Light, Dark and System theme icons**, volume controls and reduced-motion support.
- **Responsive, keyboard-accessible controls** and inline confirmations.
- **Offline static operation:** no account, remote music, tracking or sent player data.

## Requirements

- A modern browser with JavaScript and audio playback enabled.
- No Node.js or backend is needed to play.
- Built-in tracks use Web Audio; uploaded tracks use the browser's media decoder. Format support varies by browser.
- Click a play control to authorize audio. If audio is blocked, the game explains the problem and records no catch. You can retry or change music while keeping results.
- Local storage is optional; themes and volume still work for the page if saving is denied.

For physical parties, players need to hear the stop. Keep device and game volume audible. At zero game volume, a visible warning remains on the main game area.

## Installation

Download or clone [this repository](https://github.com/KhemnarMayuresh/Tools), keeping all files inside `Passing the Parcel Game` together. Open **`PassingTheParcel.html`** in a browser.

For static HTTP serving, run this from the repository root if Python is installed:

```sh
python -m http.server 8000
```

Open [the local game](http://localhost:8000/Passing%20the%20Parcel%20Game/PassingTheParcel.html). Stop the server with Ctrl+C. No internet access is needed after downloading the files.

## How to Use

| Control | Behavior |
| --- | --- |
| Game settings | Starts collapsed. Choose players, mode, play style, duration range and music before starting. |
| Start round / Next round | Starts music first, then starts the hidden random deadline after playback succeeds. |
| Pause / Resume | Freezes active elapsed time, passing and music position. Resume keeps the original remaining duration. Physical players should hold the parcel while paused. |
| Stop music | Ends playback immediately as a host override. The holder still needs confirmation; history labels this a Host stop. |
| Confirm result | Records one catch, applies elimination if selected, and unlocks the next round. |
| Cancel round | Confirms discarding unfinished play with no catch/elimination. Opening the confirmation pauses running play; cancelling it resumes only a previously running round. |
| Finish game | Available between rounds after a confirmed result. Forfeit shows totals. Ending elimination early requires confirmation and declares no champion. |
| New game | Confirms clearing progress and unlocks settings. Current setup and usable music remain available for reuse. |
| Restore defaults | Confirms clearing results, resets the roster/rules and discards uploaded music. Theme and volume preferences remain. |
| Preview music | Setup/recovery only. Plays music without a round or timer; click again to stop. |
| Volume | Adjustable during play. Zero volume shows a visible muted warning. |
| Theme icons | Top-right Light, Dark or System buttons; System follows device/browser changes. |

Names are trimmed, NFC-normalized, case-insensitively unique and **1–40 Unicode code points** long. Enter one name per line. Names are displayed as text, including Hindi, emoji and markup-like characters.

Stop settings are whole seconds from **5 to 120**. Minimum may equal maximum for a fixed-duration round. Defaults are **10–30 seconds**. Each round independently samples an integer-millisecond duration from the inclusive range using browser cryptographic randomness where available, with unbiased integer selection; older browsers fall back to their random generator. Similar times and repeated holders can occur naturally. Widen the minimum/maximum range for more timing variety. The page shows **elapsed time**, not a countdown or the chosen random duration. Only active play counts toward the deadline.

Settings lock after the first round starts. Audio failures unlock **music controls only** so you can recover without clearing players or past results. Other changes require New game.

Leaving the page or hiding its tab automatically pauses a running round. Returning, including via browser Back/Forward cache, keeps it paused until you choose Resume. If music was still preparing, preparation is cancelled; start again after returning. No one is eliminated automatically while the page is hidden.

## Game Modes

### Forfeit

Everyone remains active. A confirmed catch increments that player's total and can show one of 15 optional suggestions, such as naming three fruits or telling a joke. The group decides whether to perform it. There are no performance scores and no winner ranking derived from catch counts.

### Elimination

The confirmed holder leaves the active roster and is skipped in later on-screen rounds. With one player left, the game automatically finishes and celebrates that player with a distinct winner card and falling confetti. Final standings show the winner first, then eliminated players from the last round to the first. Reduced motion disables confetti. Finishing early shows **Ended early**, remaining players and eliminations in reverse round order, with no champion.

Past confirmed results are read-only. Finished games stay frozen until New game.

### Physical party versus on-screen simulation

**Physical party** is the default. The parcel illustration indicates music activity only; participant cards never claim to locate a real parcel. The host selects the actual holder after a stop.

**On-screen simulation** moves a virtual parcel clockwise among active players. Choose a starting player before each round. Default passing interval is **1,000 ms**, configurable from **500 to 3,000 ms**. The current simulated holder is selected automatically but the result still requires confirmation.

**Random starter** is the default: each round independently selects an active player to begin with. You can choose a specific starting player instead. Eliminated players cannot be selected. Random timing and a random starter can still repeat; results are not forced to alternate.

Passing uses elapsed active-play time rather than animation frames. At an exact pass/stop boundary, the pass happens first. For three players starting with A and a one-second interval, a stop at 2.999 seconds selects C; at 3 seconds it selects A. A late callback uses the planned stop instant, not the delayed delivery time. Reduced motion changes the visual effect, not the holder.

## Music

**Party beat** and **Gentle melody** are original note sequences synthesized locally. They require no downloaded tracks or third-party music licenses. The sounds are instrumental loops rather than recorded songs.

Uploads are optional and remain on your device. The browser checks whether a file can become ready; the extension alone cannot guarantee support. A corrupt, unsupported or oversized replacement leaves the previous usable source available. Uploaded tracks loop so a short file does not decide who catches the parcel.

**Each new round** defaults to **Continue music**. Choose **Restart music** to begin each new round at the start. Pause/Resume always keeps the current playback position. Built-in sequences also retain their offset. Preview stops before game playback.

Preparation/start has a three-second readiness timeout. Rejected playback, decoding errors or genuine depleted-buffer stalls cancel unfinished play without points or elimination, with retry/change-source guidance. Normal buffered seeks and file-loop transitions are not treated as failures. Cancelling a round invalidates delayed promises/timers so old music cannot restart another round.

## Privacy and Saved Preferences

Player names, music files, results and history exist only in this page session; refreshing clears game progress. No game data is sent to a server. Only validated theme and volume values are saved locally under **`parcel-theme`** and **`parcel-volume`**. Defaults are System theme and 35% volume.

## Code Structure

| File | Purpose |
| --- | --- |
| `PassingTheParcel.html` | Accessible setup, parcel stage, host controls, players and results. |
| `styles.css` | Responsive themes, focus, music/parcel animation and reduced motion. |
| `game-core.js` | Pure roster validation, round states, confirmed catches and elimination. |
| `round-controller.js` | Owned deadline, elapsed time, passing, pause and stale-callback protection. |
| `audio-controller.js` | Original loops, uploaded media, readiness, playback position and resource ownership. |
| `app.js` | Rendering, controls, confirmations, lifecycle coordination and preferences. |
| `parcel.svg` | Local parcel favicon. |
| `tests/` | Rules, timers, audio and actual-browser flows. |

## Developer Checks

Node.js is needed only to run these checks from the repository root:

```sh
node --test "Passing the Parcel Game/tests/*.test.cjs"
```

Browser checks use Playwright and an installed Edge browser. Set `PLAYWRIGHT_PATH` to the module folder if it is installed outside this repository:

```sh
node "Passing the Parcel Game/tests/browser-smoke.cjs"
node "Passing the Parcel Game/tests/browser-integration.cjs"
node "Passing the Parcel Game/tests/browser-lifecycle.cjs"
node "Passing the Parcel Game/tests/browser-winner.cjs"
```

Checks cover direct-file/static HTTP play, actual audio uploads, cancellation, blocked audio/storage, Unicode names, completion, themes and Back/Forward cache. Screenshots default to the system temporary directory; `PARCEL_SCREENSHOTS` can override the output folder. Tests do not require remote music or player data.

## License

Available under the [MIT License](../LICENSE). The included synthesized loops are original code-defined sequences.

## Issues & Contributions

Ideas, bug reports and pull requests are welcome through [GitHub issues](https://github.com/KhemnarMayuresh/Tools/issues). Include browser, game mode, play style, music source and steps to reproduce. Custom forfeit editing, saved games and online multiplayer remain possible future improvements.

## Author

**Mayuresh Sunil Khemnar** · [GitHub](https://github.com/KhemnarMayuresh)
