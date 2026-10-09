# ChatGPT Splitter

Split long text into editable, plain-text messages with size limits and a sequential copying workflow. Processing happens entirely in your browser; text, instructions, and edited parts are never uploaded or automatically saved.

## Use

1. Paste your source text.
2. Choose a profile and complete-message character limit. Expand **Initial instructions & final task** to customize the introductory message or final request.
3. Select **Generate parts** (Ctrl/Command+Enter).
4. Review or edit the initial instructions and part payloads.
5. Use **Copy initial instructions**, then **Copy part N**, and paste each copied message into your chosen app. The last part includes `ALL PARTS SENT` and the final task.

Per-card Copy buttons do not move the sequential cursor. Copied badges show clipboard progress, not delivery to an AI service. Restart retains edits and resets progress.

If clipboard access is denied, the selected-text fallback lets you copy manually. Select **Mark this message copied** after doing so; displaying the fallback does not advance progress.

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

## Accessibility

Labeled inputs, visible keyboard focus, polite status messages, keyboard-accessible confirmation and fallback controls, and responsive layouts support desktop and narrow screens. Ordinary textarea editing shortcuts remain available. Escape dismisses the replace-edits confirmation.

## Verification

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
