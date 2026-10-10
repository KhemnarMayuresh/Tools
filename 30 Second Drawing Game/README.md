# 30 Second Drawing Game

A simple drawing game for friends, family, classrooms, and game nights. Everyone draws the same prompt on paper, races against the timer, and chooses a winner together. You do not need to be good at drawing—creative and funny sketches are part of the fun!

**Quick start:** Open `30sDrawingGame.html`, grab paper and pencils, and click **Start round**. The default drawing time is 30 seconds. Open **Game settings** to change players, time, or prompts.

## How to Play

1. **Get ready:** Give each player paper and a pencil. Open the game on a screen everyone can see.
2. **Set up your game:** Open **Game settings**, which starts collapsed. Enter 1–12 unique player names, choose categories or individual words, and set a drawing time from 10 to 120 seconds.
3. **Start a round:** Click **Start round**. The screen shows **Ready**, then **Set**. At **Go**, the prompt appears and the drawing timer begins. Everyone draws the same prompt at the same time.
4. **Stop at time up:** Put your pencils down when the timer reaches zero. Compare your drawings and agree on a winner. Judging is up to your group: creativity, accuracy, or the funniest drawing all work.
5. **Record the result:** The host clicks the winning player's name to award **one point**, or chooses **No winner**. You can correct this result before starting the next round.
6. **Keep playing:** Click **Next round** for another unused prompt. Use **Skip prompt** during drawing if your group wants to move on without awarding points.
7. **Finish the game:** After resolving a round, click **Finish game**. See the top-three podium and the remaining players' rankings. Click **Play again** to start fresh with the same players and settings.

Drawings and voting happen outside the webpage. The game manages prompts, timing, scores, and results; it does not include a drawing canvas or automatic judging.

## Live Demo

Try the repository's online preview:

- **Option 1:** [Open with HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/30%20Second%20Drawing%20Game/30sDrawingGame.html)
- **Option 2:** [Open with GitHack](https://raw.githack.com/KhemnarMayuresh/Tools/main/30%20Second%20Drawing%20Game/30sDrawingGame.html)
- **Source:** [View the Drawing Game folder on GitHub](https://github.com/KhemnarMayuresh/Tools/tree/main/30%20Second%20Drawing%20Game)

These links preview the published `main` branch through third-party services. They may show an older version than your local files, and their availability could not be verified during this README update. To use your latest local changes, follow the installation steps below.

## Features

- **Ready, Set, Go:** A two-second preparation sequence keeps the prompt hidden until drawing starts.
- **Adjustable timer:** Choose 10–120 seconds per round; 30 seconds is the default. A circular timer, sound cues, and a final-five-second warning help everyone follow the countdown.
- **279 built-in prompts:** 150 easy **Everyday Things** words and 129 character prompts across 19 categories, including Marvel, DC, Doraemon, Shinchan, and Pokémon.
- **Editable everyday words:** Add, rename, or remove familiar objects and foods. Save your list in this browser or restore the original 150 words.
- **Custom categories:** Add your own category labels and newline-separated words.
- **Search and selection:** Search categories or words, select individual prompts, or select whole categories. Search does not change your selections.
- **Reference images:** Show local character images after the round, or while drawing. Everyday Things and custom words are text prompts without images.
- **Player scores:** Track 1–12 players, award one point per win, and correct the current round's result.
- **No automatic repeats:** Revealed prompts are used once until you reset the pool. Skip consumes the current prompt without awarding points.
- **Round history:** Review prompts, durations, winners, skipped rounds, and cancelled attempts.
- **Game-completion podium:** Celebrate the top three players with an animation and list everyone else below. Ties share a rank; reduced-motion settings disable the animation.
- **Simple layout:** Collapsed configuration, a main image/timer area, scoreboard, and round history. Light, dark, and system-theme icons sit at the top right.
- **Desktop and mobile support:** Responsive controls, keyboard focus indicators, and reduced-motion support.
- **Static and local:** No account, backend, or package installation is needed to play. Included assets and generated sound work locally.

## Requirements

### To play

- A modern browser with JavaScript enabled, such as Edge, Chrome, Firefox, or Safari.
- Paper and a pencil or pen for each player, or another surface to draw on.
- A screen the group can see. One player can also practise alone.

An internet connection is needed for online previews or downloading the repository. Once downloaded, the local game can run offline. Sound uses the browser's Web Audio support; if audio is blocked, the visual timer still works. Local storage is used for saved preferences and your edited Everyday Things list.

### To run developer checks

- Node.js with the built-in test runner.
- Playwright and Microsoft Edge for the provided browser smoke scripts.

These developer tools are optional and are not required to play.

## Installation

### Option 1: Download and open

1. [Download the repository ZIP](https://github.com/KhemnarMayuresh/Tools/archive/refs/heads/main.zip) or clone the repository:

   ```bash
   git clone https://github.com/KhemnarMayuresh/Tools.git
   ```

2. Open the **30 Second Drawing Game** folder.
3. Keep its JavaScript, CSS, and `images/` folder together.
4. Open **30sDrawingGame.html** in your browser.

No additional installation or setup is needed.

### Option 2: Serve locally

If you prefer a local web server and have Python installed, run this from the repository root:

```bash
python -m http.server 8000
```

Then open [the local game](http://localhost:8000/30%20Second%20Drawing%20Game/30sDrawingGame.html).

## How to Use

### Configure players and rounds

Open **Game settings** to edit the roster, drawing time, image mode, sound, and word selection. Player names must be unique and at most 40 characters. The roster locks when the first round starts; **New Game** unlocks it.

Settings close when a round starts so players can focus on the prompt and timer. A winner or **No winner** must be chosen before the next completed round can begin.

### Edit Everyday Things

This category is selected by default and includes familiar items such as cup, spoon, pressure cooker, tiffin box, car, auto rickshaw, cake, samosa, diya, and cricket bat.

1. Open **Game settings** and find the **Everyday Things** card.
2. Click **Edit words**.
3. Add, rename, or remove words in the list—**one per line**.
4. Click **Save words**. Use **Cancel** to discard unsaved edits.
5. To bring back the original list, click **Restore default words** and confirm.

Keep **1–200 unique words**, with at most **80 characters per word**. Blank lines and case-insensitive duplicates are ignored. Existing selections are kept; newly added words are selected automatically. Editing does not replenish used words or change labels already recorded in history.

Edits save in this browser and survive a refresh. If browser storage is unavailable, the page explains that edits last only for the current session. Editing is disabled during preparation/drawing and after game completion.

### Add other custom prompts

Under **Game settings → Add custom prompts**, enter a category and its words, one per line, then click **Add prompts**.

- Up to **10 custom categories** and **200 custom prompts** in total.
- Category labels: up to **40 characters**; words: up to **80 characters**.
- Newly added prompts are selected automatically; blank lines and duplicates are ignored.
- Invalid batches add nothing, so you can fix the list and try again.

Other custom categories remain in this page's session and disappear on refresh. Adding words to a category named **Everyday Things** updates its editable, locally saved list instead.

### Search and choose prompts

Search by category or word. Category checkboxes show full or partial selection. **Select all** includes prompts hidden by search; **Clear selection** deselects the entire pool. Clear the search to see all categories again.

If you run out of unused selected prompts, choose more words or use **Reset word pool**.

### Sound, themes, and images

- Use the **sun**, **moon**, or **monitor** icon at the top right for light, dark, or system theme.
- Turn sound cues on/off and adjust their volume in **Game settings**.
- Choose **Show after the round** for reference images after drawing, or **Show while drawing** to reveal them at Go. Images stay hidden during Ready/Set.
- Everyday Things and custom words have no reference images. Missing images do not block play or scoring.

### Understand the reset controls

| Control | What it does |
|---|---|
| **Next round** | Starts another unused selected prompt after the current result is resolved. |
| **Skip prompt** | Ends the active drawing attempt without points and keeps that prompt marked as used. |
| **Reset word pool** | Stops an active round and makes prompts available again. Keeps players, scores, and history. |
| **New Game** | Stops play, clears scores/history, refills the word pool, and unlocks the roster. Keeps players, settings, selections, and custom words. |
| **Finish game** | Freezes the results and shows the podium and remaining rankings. Available between rounds after the current result is resolved. |
| **Play again** | Clears scores/history and begins a fresh game with the same players, settings, and words. |

**Reset word pool** and **New Game** ask for confirmation. Cancelling preparation leaves its prompt unused. Cancelling an active drawing round records an aborted attempt without points; New Game clears that old history.

### Results and saved data

Equal scores share a competition rank, such as **1, 1, 3**. Tied players appear in roster order. With fewer than three players, only actual players appear on the podium. A game with no points shows a completion message without declaring a sole winner.

Refreshing clears players, scores, history, selections, and other custom categories. Theme/sound preferences and your saved Everyday Things list remain in that browser. Clearing browser storage removes those saved values.

## Code Structure

| File or folder | Purpose |
|---|---|
| `30sDrawingGame.html` | Page structure, configuration, play area, scoreboard, history, and results. |
| `styles.css` | Layout, themes, timer feedback, podium animation, and responsive styles. |
| `Data.js` | Built-in categories, prompts, default selections, and the original everyday word list. |
| `game-core.js` | Validation, round transitions, scores, rankings, and word normalization. |
| `timer-controller.js` | Deadline-based timing, cancellation, and stale-callback protection. |
| `audio.js` | Locally generated sound cues and mute/volume handling. |
| `app.js` | Controls, rendering, reference images, and local preference/word-list storage. |
| `images/` | Local character reference images. |
| `tests/` | Unit tests and browser smoke checks. |

## Developer Verification

From the repository root, run the unit tests:

```bash
node --test "30 Second Drawing Game/tests/*.test.cjs"
```

With Playwright installed, run the browser workflows:

```bash
node "30 Second Drawing Game/tests/browser-smoke.cjs"
node "30 Second Drawing Game/tests/redesign-smoke.cjs"
node "30 Second Drawing Game/tests/everyday-smoke.cjs"
node "30 Second Drawing Game/tests/everyday-storage-smoke.cjs"
```

Set `PLAYWRIGHT_PATH` to the Playwright package location if it is not installed in the usual Node module search path. The browser scripts use Microsoft Edge and open the local HTML page directly. `tests/browser-integration.cjs` additionally checks a real 10-second round.

## License

This project uses the [MIT License](../LICENSE). See the license file for its terms.

## Issues & Contributions

Have a suggestion, found a bug, or want to add more prompts?

- [Open an issue](https://github.com/KhemnarMayuresh/Tools/issues).
- [Submit a pull request](https://github.com/KhemnarMayuresh/Tools/pulls) with your proposed changes.
- Include steps to reproduce bugs and the browser/device you used.

Enjoy the game—good times matter more than perfect drawings!
