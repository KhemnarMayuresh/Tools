# Regex Tester

Test JavaScript regular expressions locally, inspect matches and capture groups, and preview replacements. No account, build step or remote service is required.

## How to Use

1. Open **index.html**. Enter a pattern without `/` delimiters and paste test text, or choose an example.
2. Select flags. Hover a flag for its meaning. **g** starts enabled; without it only the first match is returned. **u** and **v** are mutually exclusive.
3. Choose **Run** or press Ctrl/Cmd+Enter. Automatic testing starts 400 ms after typing; disable it in collapsed Settings if preferred.
4. Read highlighted matches and their UTF-16 start/end positions. Use ↑/↓ to navigate. Match cards show numbered and named captures; unmatched optional captures are labelled explicitly. Strings are quoted/escaped to distinguish whitespace and empty values. An empty match appears as a vertical marker.
5. Expand **Replacement preview**, enter replacement text, and Run. Supports JavaScript `$1`, `$&`, `$$`, prefix/suffix and named-capture replacement tokens. The original test text stays unchanged.
6. Copy the pattern as a slash-delimited expression, results as JSON, or replacement text. Clipboard denial reveals selected text for manual copying. Clear removes inputs/results.

## Features

- JavaScript regex validation and browser-supported g/i/m/s/u/v/y/d flags.
- Literal, safely rendered test text and highlighted matches.
- Numbered/named captures, UTF-16 offsets, empty-match handling and navigation.
- Replacement preview with native JavaScript semantics.
- Examples and a compact syntax reference.
- Shared local SVG icons, top-right Light/Dark/System themes and mobile layout.
- Worker-only execution with cancellation, a two-second timeout and stale-result protection.

## Requirements and Installation

A modern browser with JavaScript and Web Workers is required. Keep the HTML, CSS and scripts together and open **index.html**. Regex matching never falls back to the UI thread.

If your browser blocks workers on direct-file pages, run from the repository root with Python installed:

```sh
python -m http.server 8000
```

Open [the local tool](http://localhost:8000/Regex%20Tester/index.html). Stop the server with Ctrl+C. Processing works offline after download; no Node.js is required for ordinary use.

## Live Demo

- [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/Regex%20Tester/index.html)
- [GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/Regex%20Tester/index.html)

Links target the published main branch; local changes appear only after publication. Preview availability is unverified.

## Semantics and Limits

This uses your browser’s **JavaScript regex engine**, not PCRE or Python. Flags appear only if supported. With **y**, matches must start exactly at the current lastIndex (initially zero); with **gy**, matching continues contiguously. With **d**, the engine supports match indices, but this interface displays full-match offsets and capture values, not separate capture ranges. Unicode properties need u or v. Examples do not provide comprehensive email/date validation.

Limits: **10,000 UTF-16 units** for the pattern, **200,000** for test text, **20,000** for replacement, and **10,000 matches**. Exceeding a limit reports an error rather than silently truncating output. Workers are terminated after two seconds or Cancel. Timeouts can occur during matching or replacement.

Replacement output has a **2,000,000-character budget**. A conservative preflight estimate may reject some replacements containing `$` tokens even if their actual result would fit; narrow the pattern or shorten the input. Match cards initially render 100 results, with a button to load more. Distant navigation renders a window around the selected match. Highlighting covers all accepted matches.

All offsets are JavaScript UTF-16 code-unit positions; joined emoji and combining sequences can occupy several positions. Empty global matches advance by code point under u/v and by code unit otherwise. Enter `(?:)` to explicitly test an empty expression.

## Privacy

Only theme and automatic-run preference are stored locally. Patterns, test text, replacements and results are session-only and never automatically uploaded or saved. No external dependencies, tracking, fonts or regex requests are loaded.

## Developer Checks

Node.js is needed only for tests:

```sh
node --test "Regex Tester/tests/core.test.cjs"
```

Browser checks use Playwright and installed Edge. Set `PLAYWRIGHT_PATH` to its package folder if it is outside the repository:

```sh
node "Regex Tester/tests/browser.cjs"
```

The browser test starts its own loopback HTTP server and covers worker matching, replacement, unsafe markup rendering, errors, stale results, timeout/recovery, themes and mobile width.

| File | Purpose |
| --- | --- |
| core.js | Bounded matching, capture data and native replacement semantics. |
| worker.js | Isolated regex execution and result delivery. |
| app.js | Worker lifecycle, inputs, safe highlighting, navigation, copying and preferences. |
| icons.js | Local SVG controls matching the existing tools. |
| index.html / styles.css | Responsive interface and theme styling. |
| tests/ | Engine and browser verification. |

## License and Contributions

[MIT](../LICENSE). [Report issues](https://github.com/KhemnarMayuresh/Tools/issues) with your browser and a non-private example. Author: [Mayuresh Sunil Khemnar](https://github.com/KhemnarMayuresh).
