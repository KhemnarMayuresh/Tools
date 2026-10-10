# ChatGPT Splitter

Split long text into editable, plain-text messages with size limits and a sequential copying workflow. Processing happens entirely in your browser; text, instructions, and edited parts are never uploaded or automatically saved.

**Quick start:** Open `index.html`, paste your text, and click **Generate parts**. Copy the initial instructions, then each part in order. Use the top-right sun, moon, or monitor icon to choose a theme.

## How to Use

1. Paste your source text.
2. Choose a profile and complete-message character limit. Expand **Initial instructions & final task** to customize the introductory message or final request.
3. Select **Generate parts** (Ctrl/Command+Enter).
4. Review or edit the initial instructions and part payloads.
5. Use **Copy initial instructions**, then **Copy part N**, and paste each copied message into your chosen app. The last part includes `ALL PARTS SENT` and the final task.

Per-card Copy buttons do not move the sequential cursor. Copied badges show clipboard progress, not delivery to an AI service. Restart retains edits and resets progress.

If clipboard access is denied, the selected-text fallback lets you copy manually. Select **Mark this message copied** after doing so; displaying the fallback does not advance progress.

## Live Demo

- **Option 1:** [Open with HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/ChatGPT%20Splitter/index.html)
- **Option 2:** [Open with GitHack](https://raw.githack.com/KhemnarMayuresh/Tools/main/ChatGPT%20Splitter/index.html)
- **Source:** [View the tool on GitHub](https://github.com/KhemnarMayuresh/Tools/tree/main/ChatGPT%20Splitter)

These third-party previews use the published main branch and may differ from your local version. Availability could not be verified during this update. Use the local installation below for your latest files.

## Features

- **Smart splitting:** Prefers paragraph, sentence, and word boundaries.
- **Unicode-safe parts:** Keeps joined emoji, Hindi combining marks, and grapheme clusters intact.
- **Complete-message budgets:** Counts wrappers and final instructions in each message limit.
- **Editable output:** Review or edit the initial instructions and individual parts before copying.
- **Sequential copying:** Copy initial instructions, then one part at a time, with progress badges.
- **Manual copy fallback:** Copy selected text and confirm when clipboard access is blocked.
- **Custom instructions:** Use a template with `{totalParts}` and append your final request to the last part.
- **Profile preferences:** Remember your numeric character budgets for Manual, ChatGPT, Claude, Gemini, and Custom profiles.
- **Clear edit feedback:** Flags oversized messages and stale output without silently truncating your text.
- **Local and private:** No server, account, API key, or network tokenizer.
- **Top-right theme icons:** Light, dark, and system modes with a saved preference.
- **Responsive and accessible:** Mobile layout, keyboard controls, status messages, and incremental part loading.

## Requirements

### To use the tool

- A modern browser with JavaScript and `Intl.Segmenter` support for safe Unicode boundaries.
- Text you want to split. No account or API key is required for splitting.
- Clipboard permission is helpful; manual copying is available when it is denied.

Internet is needed to download the repository, use online previews, or send messages to your chosen external app. The splitter itself processes text offline. Larger inputs may need HTTP serving for worker support.

### Optional developer tools

Node.js runs unit tests and benchmarks. Playwright and Edge run browser smoke checks. They are not needed to split text.

## Installation

### Option 1: Download and open

1. [Download the repository ZIP](https://github.com/KhemnarMayuresh/Tools/archive/refs/heads/main.zip) or clone it:

   ```bash
   git clone https://github.com/KhemnarMayuresh/Tools.git
   ```

2. Open the **ChatGPT Splitter** folder.
3. Keep its HTML, CSS, and JavaScript files together.
4. Open **index.html** in your browser. No package installation or build step is needed.

### Option 2: Serve locally for larger inputs

If Python is installed, run this from the repository root:

```bash
python -m http.server 8000
```

Then open [the local tool](http://localhost:8000/ChatGPT%20Splitter/). A static server enables worker processing where direct-file pages restrict it.

## Splitting and limits

- Default full-message limit: 12,000 Unicode code points. Valid numeric range: 50–1,000,000.
- The limit includes `[START PART i/n]`, `[END PART i/n]`, line breaks, and final instructions. Initial instructions must also fit.
- Numeric validity alone does not guarantee a usable budget. Shorten instructions or raise the limit when the wrappers leave insufficient room for payload.
- Smart splitting prefers paragraph, sentence, then whitespace boundaries within the last 40% of the payload budget. Otherwise it uses the last fitting grapheme boundary.
- Emoji sequences, combining marks, and Hindi characters are preserved. `Intl.Segmenter` support is required; no unsafe fallback silently splits characters.
- Unedited part payloads reconstruct the source exactly as read from the textarea, including whitespace and blank lines. Browsers normalize textarea line endings. Operating systems may also normalize clipboard line endings.
- Edited parts remain exactly as entered. Over-budget messages are retained and visibly flagged, with copying disabled until corrected. Edits are never silently truncated or resplit.
- Source limit: 2 MiB of UTF-8 text. Output limit: 1,000 parts. Empty source creates no copy sequence; whitespace-only input is legitimate content.
- Initially 25 part cards are rendered. **Load 25 more parts** reveals additional cards; sequential copying reveals its next target as needed.

The initial template recognizes `{totalParts}` only. Unknown placeholder-like text remains literal. Part labels are generated automatically; marker-like strings within the payload are never parsed as application metadata.

## Profiles and token estimates

Manual, ChatGPT, Claude, Gemini, and Custom profiles remember your selected numeric character budgets. Each starts at 12,000 characters until configured. They are not verified model context-window or web-app message limits.

Token estimates use `ceil(Unicode code points / 4)`. They are approximate, especially for code and non-English text, and do not use a model tokenizer or enforce token limits. A large API context window does not imply that a web app accepts a message of that size.

## Edits and stale output

Changing the source or generation settings makes the existing output stale and disables copying. Generate again to update it. If generated messages were edited, an in-page confirmation asks before replacing them; cancelling keeps the edited content and its stale state.

Editing a copied message removes its copied badge and rewinds the sequential cursor to that message if it has already been passed. Async clipboard completions from older edits, generations, or cleared output cannot advance the current sequence.

## Running and privacy

Open `index.html` directly for small inputs, or serve the repository using any static HTTP server and visit `/ChatGPT%20Splitter/`. Keep `split-core.js`, `split-worker.js`, `scripts.js`, and `styles.css` alongside the HTML. No framework, build step, CDN, or network tokenizer is required.

Generation runs in a cancellable worker with a ten-second deadline. If the browser disallows workers under `file://`, a deferred main-thread fallback supports at most 20,000 UTF-16 code units. Serve the folder over HTTP for larger input. Worker errors and incompatible browsers show clear messages.

Only system/light/dark theme choice and numeric profile budgets are stored locally. Source text, generated messages, edits, clipboard progress, initial instructions, and final task are not stored. Clear All removes source/output and restores default instructions while retaining UI preferences.

## Themes and Accessibility

Use the **sun**, **moon**, or **monitor** icon at the top right for light, dark, or system theme. The choice is saved locally, and system mode follows device theme changes.


Labeled inputs, visible keyboard focus, polite status messages, keyboard-accessible confirmation and fallback controls, and responsive layouts support desktop and narrow screens. Ordinary textarea editing shortcuts remain available. Escape dismisses the replace-edits confirmation.

## Code Structure

| File | Purpose |
|---|---|
| `index.html` / `styles.css` | Input/settings, message cards, theme icons, and responsive layout. |
| `scripts.js` | Generation workflow, edits, clipboard progress, and UI preferences. |
| `split-core.js` | Unicode boundaries, complete-message budgets, and message serialization. |
| `split-worker.js` | Cancellable background generation. |
| `tests/` / `benchmark.cjs` | Core/browser checks and engine measurements. |

## Developer Verification

```sh
node --test "ChatGPT Splitter/tests/*.test.cjs"
node "ChatGPT Splitter/benchmark.cjs"
```

Browser checks use Playwright supplied by your development environment and an installed Edge browser:

```sh
node "ChatGPT Splitter/tests/browser-smoke.cjs"
```

Set `PLAYWRIGHT_PATH` to a Playwright package directory if it is not available through normal module resolution. `BROWSER_CHANNEL` can select another installed Chromium channel. Tests start and stop their own loopback static server; generated screenshots are ignored by Git.

Core tests cover content reconstruction, Unicode graphemes, preferred boundaries, wrapper budgets, numbering transitions, invalid limits, and resource caps. Browser tests cover cancelling obsolete generation after message edits, safe literal rendering/copy, edits and counters, sequence progress, denied clipboard/manual confirmation, stale results, regeneration, pagination, themes/profiles, narrow layout, clearing during a pending copy, cancellation, and direct-file fallback.

Development benchmarks on Windows with Node 24.21.0: approximately 411 ms for 50,000 characters, 787 ms for 500,000, and 2.1 seconds for 2,000,000. Timings depend on text and environment; they are engine measurements, not total browser rendering times.

## License

[MIT](../LICENSE).

Verification performed on Microsoft Edge (Chromium), desktop and 375px width. Firefox was not available in the development environment and remains unverified.
## Issues & Contributions

- [Open an issue](https://github.com/KhemnarMayuresh/Tools/issues) with reproduction steps, browser/device, and a small non-sensitive example.
- [Submit a pull request](https://github.com/KhemnarMayuresh/Tools/pulls) for fixes, documentation, or improvements.
- Run the relevant developer checks above before submitting code changes.
