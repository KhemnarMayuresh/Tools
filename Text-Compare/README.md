# Text Compare

A static, private text and code comparison tool. Paste text or open/drop UTF-8 files into Original and Modified, then select **Compare**. No text is uploaded or automatically saved. Only the theme preference is stored locally.

## Features

- Myers line differences, old/new line numbers, additions/deletions summary.
- Aligned split view and unified view; unified is the mobile default.
- Inline word/punctuation highlights in paired replacement lines.
- Local lexical highlighting for JavaScript/TypeScript, JSON, HTML, CSS, and Python, with filename/content detection and a Plain Text option.
- Expandable unchanged ranges; 0, 3, 5, 10 context lines or full file.
- Previous/next hunk navigation, copy unified patch, download `.diff`.
- Ignore horizontal spaces/tabs, system/light/dark themes, worker cancellation and input limits.

## Running

Open `index.html` directly for small comparisons, or serve the repository with any static HTTP server and visit `/Text-Compare/`. Keep all sibling scripts and `styles.css` together. There are no network-loaded dependencies or build steps.

Some browsers prohibit workers under `file://`. A deferred, bounded main-thread fallback supports at most 40,000 combined characters and a smaller computation budget. For larger inputs, use static HTTP serving. Clipboard access can require a secure origin; when unavailable, a selected patch textarea supports manual copying.

## Comparison semantics

- Case-sensitive display comparison; CRLF and LF line separators are treated equivalently. Patch export preserves original file line endings, including CRLF/LF-only changes. Lone CR is retained as text. Browsers normalize pasted/edited textarea content to LF; uploaded file contents retain their original endings until edited.
- A final newline is significant; changed lines show a no-final-newline indicator when appropriate.
- Ignore spaces/tabs collapses horizontal runs and ignores leading/trailing spaces/tabs. It preserves blank lines, case, and other Unicode whitespace.
- Whitespace-ignore affects the display only. Patch export computes an exact comparison, including hidden whitespace and line-ending changes.
- Replacements count as removed and added lines. Pairing for inline highlights follows block order, and is a display aid rather than semantic code matching.
- No changes produces an empty patch. For file-based patch application, header filenames must match your target files. Pasted text uses `original.txt` / `modified.txt`; adjust headers if applying to a named file.

## Limits

Each input is limited to 2 MiB and 50,000 lines. Comparison uses a bounded frontier budget of 250,000 steps (20,000 in the direct-file fallback) and a five-second worker deadline. Complex comparisons stop with a visible error; output is never silently approximated. Pure insertions/deletions and shared prefixes/suffixes have a fast path.

Initial output is limited to 600 visual rows, with **Show more rows** to reveal further output. Distant navigation starts a bounded window around the target hunk; **Show earlier rows** returns to preceding content. Inline computation is skipped above 4,000 combined characters or its own token budget; syntax highlighting is skipped for lines longer than 20,000 characters. The local highlighter is lexical, not a complete parser: multiline constructs and advanced language syntax may have incomplete colors. It is repository-owned code covered by the root MIT license, with no third-party runtime library.

## Keyboard and accessibility

- Ctrl/Command+Enter: compare.
- Alt+Up / Alt+Down: previous/next change hunk.
- Tab: move through labeled controls and expandable context buttons.

Ordinary textarea arrow keys remain available. Results use line numbers and +/- indicators in addition to color. Status is announced through a live region. All input content renders as text nodes, including markup and filenames.

## Verification

Pure-function and actual Git patch-application tests:

```sh
node --test Text-Compare/tests/*.test.cjs
```

Browser smoke checks use Playwright and an installed Microsoft Edge browser:

```sh
node Text-Compare/tests/browser-smoke.cjs
```

Install/provide Playwright in your environment, or set `PLAYWRIGHT_PATH` to its package directory. The browser script starts and stops its own loopback static server. It covers views, line counts, inline/syntax highlights, safe markup rendering, theme, whitespace, folds, navigation, imports, pagination, cancellation, mobile width, clear, and direct-file fallback. The generated mobile screenshot is ignored by Git.

Engine benchmarks:

```sh
node Text-Compare/benchmark.cjs
```

On Node 24.21.0 on the development Windows machine: a 10,000-line file with one replacement took approximately 70–100 ms; completely different 10,000-line files were rejected by the reduced complexity budget in about 468 ms. These are engine-only timings, not browser rendering guarantees.

Additional browser review checklist:

- Verify clipboard success and denied-access fallback; inspect downloaded patch.
- Try unsupported binary/invalid UTF-8, oversized file/paste, and a cancelled picker.
- Edit/clear during pending file reads and comparisons; obsolete results must not reappear.
- Try very long lines and repeated lines with unequal replacement block sizes.
- Verify desktop split alignment and mobile horizontal scrolling with light and dark themes.
- Check Firefox and another mobile browser before release. Edge automated checks ran here; Firefox's runtime was unavailable.

## License

[MIT](../LICENSE).
