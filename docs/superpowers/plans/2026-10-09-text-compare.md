# Text-Compare Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking. Implementation is a separate task from this planning request.

**Goal:** Rebuild Text-Compare into a responsive, client-side code and plain-text comparison tool with accurate line differences and useful review controls.

**Architecture:** Keep the existing static entry point and split its inline code into focused scripts. A worker computes a shared diff model; split view, unified view, navigation, summaries, and export consume that model. Inputs remain local to the browser.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Web Workers; locally bundled syntax highlighter if selected during implementation. No application framework or backend required. Node's built-in test runner for pure functions.

**Spec:** `tools_analysis.md`, section 1, Text-Compare.

## Findings from the existing code

`Text-Compare/index.html` passes complete strings to `lcs(a, b)`, allocates an `(a.length + 1) × (b.length + 1)` matrix, and repeatedly inserts at the beginning of its result array. This causes quadratic memory and time costs, with additional reconstruction overhead. Output highlights individual characters independently in two panels, so inserted lines do not align opposite placeholders. There are no line numbers, hunks, file controls, or export facilities.

Character differences are useful as a secondary layer inside changed lines; the problem is using them as the primary comparison unit. Syntax highlighting improves readability and should not change equality rules. The report's statement that there is no responsive design needs qualification: a viewport tag exists, but the fixed two-column layout has no narrow-screen adaptation.

## Global constraints and proposed defaults

- Scope is Text-Compare only; leave the other five tools unchanged.
- Preserve the static `Text-Compare/index.html` entry point and pasted-text workflow.
- All text processing stays local; never persist input text automatically.
- Default comparison is case-sensitive and whitespace-sensitive. Treat CRLF and LF as equivalent line separators, preserve the final-newline flag, and explicitly document that policy.
- Ignore whitespace means ignore runs of horizontal spaces and tabs, including leading/trailing horizontal whitespace. Do not ignore blank lines or case. Keep original text for rendering.
- Default view: split on wide screens, unified on narrow screens. Default context: three unchanged lines around each change.
- Export always describes the original inputs exactly under the documented line-ending policy. When whitespace is ignored, explain that export includes those hidden changes and calculate a separate exact diff.
- Use local assets, readable contrast, visible focus, and text/symbol indicators alongside red/green colors.
- These defaults are design proposals where the report is silent, not existing requirements.

## Review focus

1. Empty inputs and final-newline changes must not create phantom lines.
2. Repeated lines and unequal replacement blocks must retain deterministic ordering and correct line numbers.
3. Pasted HTML and filenames must render as inert text.
4. A previous comparison must never overwrite a newer result after editing or cancellation.
5. Very different large files and extremely long lines must remain cancellable and avoid unbounded work.

## File structure and shared interfaces

- Modify `Text-Compare/index.html`: accessible inputs, toolbar, result container, script loading.
- Create `Text-Compare/styles.css`: layout, row styles, themes, mobile presentation.
- Create `Text-Compare/diff-core.js`: line tokenization, line diff, hunk construction, inline tokens, summary.
- Create `Text-Compare/diff-worker.js`: cancellable computation boundary and request IDs.
- Create `Text-Compare/diff-renderer.js`: safe unified/split rendering and collapsed context.
- Create `Text-Compare/patch-export.js`: unified patch serialization.
- Create `Text-Compare/app.js`: input state, worker lifecycle, controls, navigation, imports, export.
- Create `Text-Compare/tests/*.test.cjs`: pure-function regression tests; browser verification checklist in `Text-Compare/README.md`.
- If highlighting is added, keep its pinned distribution and license in `Text-Compare/vendor/`.

Use scripts compatible with the existing static hosting. Make pure-function files usable both by classic browser scripts/workers and Node tests, avoiding a new build pipeline. Verify direct `file://` use; when workers are unavailable, use a bounded, yielding fallback and display a clear limitation for inputs beyond its limit.

Shared model:

```text
Line = { text: string, hasNewline: boolean }
Row = { kind: 'equal'|'delete'|'insert', oldLine: number|null,
        newLine: number|null, oldText: string|null, newText: string|null }
DiffResult = { rows: Row[], additions: number, deletions: number }
Hunk = { startRow: number, endRow: number, oldStart: number,
         oldCount: number, newStart: number, newCount: number }
```

Line numbers are one-based; hunk row indexes are zero-based and end-exclusive. A replacement contributes deleted and inserted lines, not a separate modification count. Display-only pairing must never alter patch ordering.

## Task 1: Accurate line-diff engine

**Files:** `diff-core.js`, `tests/diff-core.test.cjs`.

**Interfaces:** `tokenizeLines(text) -> Line[]`; `compareLines(oldText, newText, {ignoreWhitespace}) -> DiffResult`; `buildHunks(rows, contextLines) -> Hunk[]`.

- [ ] Add failing tests: empty/empty has zero rows and counts; `a\nb\n` versus `a\nc\n` has one deletion and one insertion; insertion at start has null old line; identical repeated lines stay equal; CRLF/LF normalize; adding a final newline remains detectable.
- [ ] Run `node --test Text-Compare/tests/diff-core.test.cjs`; confirm failures identify missing behavior.
- [ ] Implement line tokenization and Myers-style line comparison with bounded memory. Preserve source text separately from whitespace-normalized comparison keys. Trim shared prefixes/suffixes before comparing the changed middle.
- [ ] Add hunk tests: three-line context, overlapping context merges, separate distant changes, insertion/deletion at file boundaries, zero-length input ranges.
- [ ] Run the same test command; require all tests to pass. Record counts for representative fixtures.
- [ ] Commit the engine and tests as one independently reviewable change if commits are requested during execution.

## Task 2: Responsive comparison views

**Files:** `index.html`, `styles.css`, `diff-renderer.js`, `app.js`.

**Interfaces:** `renderDiff(container, result, {view, contextLines, expandedRanges})`; view is `split` or `unified`.

- [ ] Replace the inline comparison handler with the engine interface; retain Compare and Clear All actions.
- [ ] Render unified rows with old/new gutters and +/- indicators. Render split rows with paired deletion/insertion blocks and blank cells for unmatched rows.
- [ ] Use text nodes for user content; preserve tabs and indentation with monospace text and horizontal scrolling. Make aligned cells share a row height.
- [ ] Add summary counts, identical/empty messages, explicit labels for Original and Modified, and an accessible view toggle.
- [ ] Verify pure insertion, pure deletion, 2-to-1 replacements, repeated lines, long lines, and literal `<script>` text in both views. At 375px and desktop width, require usable controls and readable line numbers without page-level overflow.

## Task 3: Context folding and change navigation

**Files:** `diff-core.js`, `diff-renderer.js`, `app.js`, `tests/diff-core.test.cjs`.

**Interfaces:** Consume `buildHunks`; navigation targets hunk anchors, not individual changed characters.

- [ ] Show three context lines by default, expandable omitted ranges, a full-file option, and a context selector restricted to 0, 3, 5, or 10 lines.
- [ ] Add Previous/Next controls, current change position, and documented Alt+Up/Alt+Down shortcuts. Do not intercept ordinary textarea arrow keys.
- [ ] Verify navigation reveals its target, view changes preserve the active hunk, no-change results disable navigation, and expanding context leaves summary counts unchanged.

## Task 4: Inline differences and syntax highlighting

**Files:** `diff-core.js`, `diff-renderer.js`, `app.js`, optional `vendor/`, `tests/diff-core.test.cjs`.

**Interfaces:** `compareInline(oldLine, newLine) -> {oldTokens, newTokens}`; token is `{text, changed}`. Highlighting annotates text ranges and never controls comparison.

- [ ] Add failing token tests: changing `count = 1` to `count = 2` marks the number while retaining common text; whitespace, punctuation, emoji, and non-Latin text reconstruct exactly.
- [ ] Compute word/punctuation differences only for plausibly paired replacement lines. Use whole-line highlighting for unrelated lines and skip expensive inline processing above a documented length budget.
- [ ] Add language selector, Plain Text fallback, and auto-detection using filename first and a restricted language set second. Bundle a pinned highlighter locally and include its license.
- [ ] Compose syntax and diff spans from offsets/text nodes so neither layer erases the other or permits input HTML execution.
- [ ] Run core tests and inspect JavaScript, JSON, HTML, plain text, emoji, and very long replacement lines in both views.

## Task 5: Text-file import and comparison options

**Files:** `index.html`, `app.js`, `tests/diff-core.test.cjs`.

- [ ] Add independent file picker and drag/drop targets for Original and Modified, showing filename and size. Decode as UTF-8 with clear errors for invalid data; identify unsupported binary input without relying only on extension.
- [ ] Introduce a proposed initial 2 MiB per-input limit; validate before reading and before comparing pasted input. Record the chosen limit in the UI and README.
- [ ] Wire ignore-whitespace to the engine and invalidate results whenever inputs or comparison options change. Disable export on stale results.
- [ ] Add tests proving horizontal whitespace can be ignored while case and blank-line changes remain visible. Verify original indentation survives rendering.
- [ ] Verify cancelled picker, failed read, unsupported input, oversized paste/drop, and loading a file on only one side produce understandable states without losing the other input.

## Task 6: Correct unified patch export

**Files:** `patch-export.js`, `app.js`, `tests/patch-export.test.cjs`.

**Interfaces:** `createPatch(oldText, newText, {oldName, newName, contextLines}) -> string`.

- [ ] Add failing fixtures with `---`/`+++` headers, `@@` ranges, context prefixes, additions/deletions, empty-side ranges, and `\ No newline at end of file` markers.
- [ ] Serialize from an exact diff with safe single-line filename headers; use `original.txt` and `modified.txt` when unnamed.
- [ ] Add Copy Patch and Download .diff; show clipboard errors with a selectable-text fallback and release download object URLs.
- [ ] Run `node --test Text-Compare/tests/patch-export.test.cjs`. In a temporary Git repository, verify exported fixtures with `git apply --check` and apply representative patches to confirm expected contents.
- [ ] Verify export remains exact when ignore-whitespace hides visual changes; explain this behavior next to export controls.

## Task 7: Responsiveness, cancellation, and themes

**Files:** `diff-worker.js`, `app.js`, `styles.css`, `README.md`.

**Interfaces:** Worker input `{requestId, oldText, newText, options}`; output `{requestId, result}` or `{requestId, error}`. Ignore responses for obsolete request IDs.

- [ ] Move diff computation to a worker, show progress state, and make Cancel terminate the worker. Editing, clearing, or starting a new comparison invalidates prior work.
- [ ] Bound algorithm work and rendering; after a proposed five-second compute deadline, stop and offer a clearly labeled coarse whole-block diff or smaller input. Do not silently claim coarse output is minimal.
- [ ] Render large results incrementally or through windowed rows; benchmark both nearly identical and completely different 10,000-line files, plus a huge single line. Record browser, input sizes, elapsed time, and cancellation responsiveness.
- [ ] Add system/light/dark themes and store only UI preferences. Verify contrast, keyboard focus, status announcements, and absence of automatic input persistence.
- [ ] Verify worker failure and direct file opening use the documented fallback without locking the page. Test stale worker responses after an immediate second comparison.

## Task 8: Final validation and documentation

**Files:** `README.md`, all changed Text-Compare files.

- [ ] Run `node --test Text-Compare/tests/*.test.cjs`; require zero failures.
- [ ] Complete the browser checklist in current Chromium and Firefox, desktop and narrow viewport: paste, upload/drop, compare, both views, folds, navigation, language, whitespace, theme, clear, copy, download, cancellation, and worker fallback.
- [ ] Verify all thirteen requested features from the report map to Tasks 1–7; inspect console errors and ensure text content does not leave the browser.
- [ ] Document usage, comparison semantics, input/work limits, keyboard shortcuts, static serving, file-opening limitations, local dependency versions/licenses, and benchmark results.
- [ ] Review the final diff for accidental changes to other tools and document any unmet acceptance criterion before declaring completion.

## Delivery sequence

Tasks 1–2 establish the first usable release: correct line differences, aligned views, line numbers, and summary. Tasks 3–6 complete review and export workflows. Task 7 establishes performance and visual quality, and Task 8 verifies the finished tool. Worker support can be introduced earlier if engine benchmarks require it; ship only after its safeguards pass.

## Plan self-review

All report requirements have an owner: line comparison (1), line numbers/views/summary (2), context/navigation (3), word highlighting/language detection/syntax (4), file upload/whitespace (5), copy/export (6), performance/dark mode (7). The five review-focus conditions are covered by Tasks 1, 2, 4, 6, and 7. No application code was changed as part of this planning request.
