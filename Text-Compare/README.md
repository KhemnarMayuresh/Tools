# Text Compare

Compare two versions of text or code, see exactly what changed, and export a patch. Processing stays in your browser; your text is not uploaded or saved automatically.

**Quick start:** Open `index.html`, paste into **Original** and **Modified**, then click **Compare**. Use the top-right sun, moon, or monitor icon for light, dark, or system theme.

## How to Use

1. **Add the original:** Paste into **Original**, use **Open file**, or drop a UTF-8 file into that panel.
2. **Add the new version:** Put the updated text or file in **Modified**.
3. **Compare:** Click **Compare**, or press **Ctrl/Command+Enter**.
4. **Read the changes:** Added lines show a plus sign; deleted lines show a minus sign. Line numbers and inline highlights help locate edits.
5. **Choose your view:** Use **Split** to see both versions side by side or **Unified** for one combined list. Mobile starts in unified view.
6. **Focus the result:** Adjust context lines, expand unchanged ranges, choose a highlighting language, or ignore spaces and tabs.
7. **Move between changes:** Use the previous/next change controls or **Alt+Up / Alt+Down**. Use **Show more rows** for additional output.
8. **Export:** Copy the unified patch or download the `.diff` file. When clipboard access is unavailable, copy from the selected fallback text.
9. **Start again:** **Clear all** empties the inputs and results. **Cancel** stops an in-progress comparison.

For example, comparing `Hello world` with `Hello India` shows the original line removed, the new line added, and the changed words highlighted. No changes produces an empty patch.

## Live Demo

- **Option 1:** [Open with HTML Preview](https://htmlpreview.github.io/?https://github.com/KhemnarMayuresh/Tools/blob/main/Text-Compare/index.html)
- **Option 2:** [Open with GitHack](https://raw.githack.com/KhemnarMayuresh/Tools/main/Text-Compare/index.html)
- **Source:** [View the tool on GitHub](https://github.com/KhemnarMayuresh/Tools/tree/main/Text-Compare)

These third-party previews use the published main branch and may differ from your local version. Availability could not be verified during this update. Use the local installation below for your latest files.

## Features

- Myers line differences, old/new line numbers, additions/deletions summary.
- Aligned split view and unified view; unified is the mobile default.
- Inline word/punctuation highlights in paired replacement lines.
- Local lexical highlighting for JavaScript/TypeScript, JSON, HTML, CSS, and Python, with filename/content detection and a Plain Text option.
- Expandable unchanged ranges; 0, 3, 5, 10 context lines or full file.
- Previous/next hunk navigation, copy unified patch, download `.diff`.
- Ignore horizontal spaces/tabs, top-right theme icons, worker cancellation and input limits.

## Requirements

### To use the tool

- A modern browser with JavaScript enabled.
- Plain text or UTF-8 files to compare.
- No account, API key, framework, or package installation.

Internet is needed to download the repository or use online previews. Local processing works offline. Large comparisons require worker support and may need HTTP serving; clipboard permissions vary by browser.

### Optional developer tools

Node.js runs unit tests and benchmarks. Git is needed for patch-application tests or applying exported patches; Playwright and Edge run the browser smoke checks. None is required for ordinary comparison.

## Installation

### Option 1: Download and open

1. [Download the repository ZIP](https://github.com/KhemnarMayuresh/Tools/archive/refs/heads/main.zip) or clone it:

   ```bash
   git clone https://github.com/KhemnarMayuresh/Tools.git
   ```

2. Open the **Text-Compare** folder.
3. Keep its HTML, CSS, and JavaScript files together.
4. Open **index.html** in your browser. No package installation or build step is needed.

### Option 2: Serve locally for larger inputs

If Python is installed, run this from the repository root:

```bash
python -m http.server 8000
```

Then open [the local tool](http://localhost:8000/Text-Compare/). A static server enables worker processing where direct-file pages restrict it.

## Running and Privacy

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

## Themes, Keyboard, and Accessibility

- **Sun / moon / monitor icons:** light, dark, or system theme. Your choice is saved locally; system mode follows device changes.
- Ctrl/Command+Enter: compare.
- Alt+Up / Alt+Down: previous/next change hunk.
- Tab: move through labeled controls and expandable context buttons.

Ordinary textarea arrow keys remain available. Results use line numbers and +/- indicators in addition to color. Status is announced through a live region. All input content renders as text nodes, including markup and filenames.

## Code Structure

| File | Purpose |
|---|---|
| `index.html` / `styles.css` | Controls, layout, theme icons, and responsive results. |
| `app.js` | User actions, imports, comparison orchestration, and theme preferences. |
| `diff-core.js` / `diff-worker.js` | Bounded line comparison and background processing. |
| `diff-renderer.js` / `syntax.js` | Diff rendering, inline edits, and local syntax highlighting. |
| `patch-export.js` | Exact unified patch generation. |
| `tests/` / `benchmark.cjs` | Regression checks and engine benchmarks. |

## Developer Verification

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

## Issues & Contributions

- [Open an issue](https://github.com/KhemnarMayuresh/Tools/issues) with reproduction steps, browser/device, and a small non-sensitive example.
- [Submit a pull request](https://github.com/KhemnarMayuresh/Tools/pulls) for fixes, documentation, or improvements.
- Run the relevant developer checks above before submitting code changes.
