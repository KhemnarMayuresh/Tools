# JSON Formatter & Viewer

Format, validate and explore JSON locally. Numeric literals and duplicate object entries are preserved; your JSON is never automatically saved or uploaded.

## How to Use

1. Open **index.html**. Paste JSON, choose **Open file**, or drop a UTF-8 file onto Input. **Sample** loads an example.
2. Choose **Format** (Ctrl/Cmd+Enter) or **Minify**. Errors show a line/column and select the approximate error location.
3. Switch between **Text** and **Tree**. Expand individual nodes, collapse all, or expand all. Tree output initially renders up to 500 nodes; reveal more with the button.
4. Search keys and values in Tree and use ↑/↓ to select matches. Search opens ancestor nodes and displays a bounded window around the match. Expand all returns to the beginning.
5. Use **Path** to copy a node’s JSON Pointer or **Value** to copy that node as JSON. The root pointer is an empty string. Duplicate keys make paths ambiguous; a warning explains this.
6. Copy or download the current JSON. Clipboard denial reveals selected text for manual copying. Editing input invalidates output and disables exports until processed again.

## Features

- Strict JSON validation, including object, array and primitive roots.
- Two/four-space or tab indentation; whitespace-free minification.
- Exact number literals: large integers, exponent notation and negative zero are not rounded.
- Duplicate keys retained with a warning; no automatic repair, sorting or conversion.
- Expandable typed tree, array/property counts, key/value search and JSON Pointer copying.
- UTF-8 file input and standard `application/json;charset=utf-8` downloads.
- Top-right Light, Dark and System icons, responsive layout and keyboard focus.
- Cancellable background processing and stale-result protection.

## Requirements and Installation

Use a modern browser with JavaScript, TextEncoder/TextDecoder and file-download support. Keep all files in this folder together and open **index.html**. No account, API key, package installation or build step is required.

For larger input, serve the repository over HTTP. With Python installed, run from the repository root:

```sh
python -m http.server 8000
```

Open [the local tool](http://localhost:8000/JSON%20Formatter%20%26%20Viewer/index.html). Stop the server with Ctrl+C. Downloaded files operate offline.

## Live Demo

- [HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/JSON%20Formatter%20%26%20Viewer/index.html)
- [GitHack preview](https://raw.githack.com/KhemnarMayuresh/Tools/main/JSON%20Formatter%20%26%20Viewer/index.html)

These links point to the published main branch; local changes require publication to appear there. Preview availability has not been verified.

## Privacy and Limits

Only theme and indentation preferences are saved locally. Source, results and file contents are session-only. There are no external scripts, fonts, tracking or data requests. Content is rendered as text, including keys containing HTML.

Input is limited to **2 MiB UTF-8**, **128 nesting levels** and **100,000 value nodes**. Workers have a ten-second deadline. Browsers restricting workers on direct-file pages use a deferred local fallback for up to **40,000 UTF-16 code units**; serve over HTTP for larger input. The fallback cannot be interrupted during its bounded parse. Failed processing leaves no exportable stale result.

Tree rendering starts at 500 visible nodes. Search considers all parsed nodes and navigates with a bounded rendering window. String previews use JSON escaping; copying Value includes the complete node. Numbers remain text literals internally, so they are never converted to JavaScript floating-point values. Other applications may still round them when parsing. String escape spelling may normalize while the decoded string value is preserved.

Duplicate keys are accepted and retained; many other JSON consumers keep only the last occurrence. Paths to duplicate keys cannot uniquely identify an entry. No comments, trailing commas, JSON5 or schema validation are supported.

A download request can be blocked by your browser or antivirus; the tool cannot certify acceptance or bypass a detection.

## Code and Developer Checks

| File | Purpose |
| --- | --- |
| core.js | Bounded parser, literal-preserving serialization, duplicate detection and JSON Pointer escaping. |
| worker.js | Background parsing and structured results. |
| app.js | Inputs, cancellation, views, search, clipboard, exports and preferences. |
| index.html / styles.css | Responsive interface and themes. |
| tests/ | Parser and actual-browser regression checks. |

Node.js is needed only for tests:

```sh
node --test "JSON Formatter & Viewer/tests/core.test.cjs"
```

Browser checks require Playwright and installed Edge; set `PLAYWRIGHT_PATH` to the package directory when installed outside the repository:

```sh
node "JSON Formatter & Viewer/tests/browser.cjs"
```

## License and Contributions

[MIT](../LICENSE). [Report issues](https://github.com/KhemnarMayuresh/Tools/issues) with browser, input size and a non-private reproduction. Author: [Mayuresh Sunil Khemnar](https://github.com/KhemnarMayuresh).
